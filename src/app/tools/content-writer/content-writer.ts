import { Component, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-content-writer',
  standalone: true,
  templateUrl: './content-writer.html',
  styleUrl: './content-writer.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentWriter),
      multi: true,
    },
  ],
})
export class ContentWriter implements ControlValueAccessor {
  @ViewChild('editorRef', { static: true }) editorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('colorInput', { static: true }) colorInput!: ElementRef<HTMLInputElement>;

  private savedRange: Range | null = null;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Required by ControlValueAccessor
  writeValue(value: string): void {
    if (this.editorRef) {
      this.editorRef.nativeElement.innerHTML = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.editorRef) {
      this.editorRef.nativeElement.contentEditable = (!isDisabled).toString();
    }
  }

  // Notify Angular form whenever content changes
  onInput() {
    const value = this.editorRef.nativeElement.innerHTML;
    this.onChange(value);
    this.onTouched();
  }

  // ------- Existing methods below ------- //

  private focusEditor() {
    this.editorRef.nativeElement.focus();
  }

  private saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0).cloneRange();
    }
  }

  private restoreSelection() {
    const selection = window.getSelection();
    if (this.savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
    }
  }

  makeBold() {
    this.focusEditor();
    document.execCommand('bold');
    this.onInput();
  }

  makeItalic() {
    this.focusEditor();
    document.execCommand('italic');
    this.onInput();
  }

  makeHeading() {
    this.focusEditor();
    document.execCommand('formatBlock', false, 'h2');
    this.onInput();
  }

  openColorPicker() {
    this.saveSelection();
    this.colorInput.nativeElement.click();
  }

  changeTextColor(event: Event) {
    this.restoreSelection();
    const input = event.target as HTMLInputElement;
    const color = input?.value;
    if (color) {
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('foreColor', false, color);
      this.onInput();
    }
  }

  resetFormatting() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText.trim()) return;

    range.deleteContents();
    range.insertNode(document.createTextNode(selectedText));
    selection.removeAllRanges();
    this.onInput();
  }

  applyHighlight(className: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    const span = document.createElement('span');
    span.className = className;
    span.textContent = selectedText;

    range.deleteContents();
    range.insertNode(span);

    const newRange = document.createRange();
    newRange.setStart(span, 0);
    newRange.setEnd(span, span.textContent?.length || 0);
    selection.removeAllRanges();
    selection.addRange(newRange);

    this.onInput();
  }
}
