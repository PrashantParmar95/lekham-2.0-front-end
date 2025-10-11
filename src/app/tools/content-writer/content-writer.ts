import {
  Component,
  ElementRef,
  ViewChild,
  forwardRef,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {Chat} from '../../chat/chat';

@Component({
  selector: 'app-content-writer',
  standalone: true,
  templateUrl: './content-writer.html',
  styleUrls: ['./content-writer.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentWriter),
      multi: true,
    },
  ],
  imports: [
    Chat
  ]
})
export class ContentWriter implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('editorRef', { static: true }) editorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('colorInput', { static: true }) colorInput!: ElementRef<HTMLInputElement>;

  // saved selection range
  private savedRange: Range | null = null;

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};
  private isDisabled = false;

  // toolbar active states
  isBold = false;
  isItalic = false;
  isHeading = false;
  isOrdered = false;
  isUnordered = false;

  // keep a bound ref for selectionchange listener so we can remove it
  private boundSelectionChange = this.handleSelectionChange.bind(this);

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // update toolbar state on selection changes
    document.addEventListener('selectionchange', this.boundSelectionChange);
    // ensure initial states reflect content
    this.updateToolbarState();
  }

  ngOnDestroy(): void {
    document.removeEventListener('selectionchange', this.boundSelectionChange);
  }

  // CONTROLVALUEACCESSOR API
  writeValue(value: string): void {
    if (this.editorRef) {
      this.editorRef.nativeElement.innerHTML = value || '';
      this.updateToolbarState();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = !!isDisabled;
    if (this.editorRef) {
      this.editorRef.nativeElement.contentEditable = (!this.isDisabled).toString();
      this.cdr.markForCheck();
    }
  }

  // Notify Angular when the editor content changes
  onInput() {
    const value = this.editorRef.nativeElement.innerHTML;
    this.onChange(value);
    this.onTouched();
    this.updateToolbarState();
  }

  // Focus helpers and selection save/restore
  private focusEditor() {
    if (!this.isDisabled) {
      this.editorRef.nativeElement.focus();
    }
  }

  private saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0).cloneRange();
    }
  }

  private restoreSelection() {
    const sel = window.getSelection();
    if (this.savedRange && sel) {
      try {
        sel.removeAllRanges();
        sel.addRange(this.savedRange);
      } catch (e) {
        // some browsers may throw if range isn't valid; ignore safely
      }
    }
  }

  // UTILITY: update toolbar boolean states using commandState where available
  private updateToolbarState() {
    try {
      this.isBold = document.queryCommandState && document.queryCommandState('bold');
      this.isItalic = document.queryCommandState && document.queryCommandState('italic');
      this.isHeading = document.queryCommandValue && (document.queryCommandValue('formatBlock') || '').toLowerCase() === 'h2';
      this.isOrdered = document.queryCommandState && document.queryCommandState('insertOrderedList');
      this.isUnordered = document.queryCommandState && document.queryCommandState('insertUnorderedList');
    } catch (e) {
      // ignore
    }
    this.cdr.markForCheck();
  }

  // selectionchange handler -> update toolbar state
  private handleSelectionChange() {
    // only update when selection is inside our editor
    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const container = this.editorRef.nativeElement;
    if (container.contains(range.commonAncestorContainer)) {
      this.updateToolbarState();
    }
  }

  /* ---------- Editor Actions ---------- */

  toggleBold() {
    if (this.isDisabled) return;
    this.focusEditor();
    document.execCommand('bold');
    this.onInput();
  }

  toggleItalic() {
    if (this.isDisabled) return;
    this.focusEditor();
    document.execCommand('italic');
    this.onInput();
  }

  toggleHeading() {
    if (this.isDisabled) return;
    this.focusEditor();
    // toggle H2: if currently H2 then make paragraph else H2
    const isH2 = (document.queryCommandValue && (document.queryCommandValue('formatBlock') || '').toLowerCase() === 'h2');
    document.execCommand('formatBlock', false, isH2 ? 'p' : 'h2');
    this.onInput();
  }

  toggleOrderedList() {
    if (this.isDisabled) return;
    this.focusEditor();
    document.execCommand('insertOrderedList');
    this.onInput();
  }

  toggleUnorderedList() {
    if (this.isDisabled) return;
    this.focusEditor();
    document.execCommand('insertUnorderedList');
    this.onInput();
  }

  undo() {
    if (this.isDisabled) return;
    this.focusEditor();
    document.execCommand('undo');
    this.onInput();
  }

  redo() {
    if (this.isDisabled) return;
    this.focusEditor();
    document.execCommand('redo');
    this.onInput();
  }

  // insert link (simple prompt). Adds target blank for safety
  insertLink() {
    if (this.isDisabled) return;
    this.saveSelection();
    const url = window.prompt('Enter URL (include http:// or https://):', 'https://');
    if (!url) return;
    this.restoreSelection();
    this.focusEditor();
    // use execCommand to create link on selected text
    document.execCommand('createLink', false, url);
    // set target="_blank" for created link nodes (execCommand creates <a>)
    // walk selection to adjust anchor if needed
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const node = sel.anchorNode;
      const anchor = this.findClosest(node, 'A') as HTMLAnchorElement | null;
      if (anchor) {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
      }
    }
    this.onInput();
  }

  // remove formatting for current selection: convert to plain text node
  removeFormatting() {
    if (this.isDisabled) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const text = range.toString();
    if (!text.trim()) return;
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    // move caret after inserted text
    sel.removeAllRanges();
    const newRange = document.createRange();
    const node = this.editorRef.nativeElement;
    // try to set caret at end of inserted node (best-effort)
    if (node.lastChild) {
      newRange.setStartAfter(node.lastChild);
    } else {
      newRange.setStart(node, node.childNodes.length);
    }
    sel.addRange(newRange);
    this.onInput();
  }

  // open color input
  openColorPicker() {
    if (this.isDisabled) return;
    this.saveSelection();
    this.colorInput.nativeElement.click();
  }

  changeTextColor(event: Event) {
    if (this.isDisabled) return;
    this.restoreSelection();
    const input = event.target as HTMLInputElement;
    const color = input?.value;
    if (!color) return;
    // prefer CSS-based styling
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('foreColor', false, color);
    this.onInput();
  }

  // apply a highlight class to selection (wrap in span)
  applyHighlight(className: string) {
    if (this.isDisabled) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const text = range.toString();
    if (!text.trim()) return;

    // Create span with class and insert
    const span = document.createElement('span');
    span.className = className;
    // preserve potential inline formatting by using innerHTML of a temp fragment
    // but simplest approach: textContent to avoid nested tags complexity
    span.textContent = text;

    range.deleteContents();
    range.insertNode(span);

    // move selection to inside the new span
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);

    this.onInput();
  }

  // utility: find closest ancestor of a node matching tagName
  private findClosest(node: Node | null, tagName: string): HTMLElement | null {
    while (node && node !== this.editorRef.nativeElement) {
      if (node instanceof HTMLElement && node.tagName === tagName.toUpperCase()) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }
}
