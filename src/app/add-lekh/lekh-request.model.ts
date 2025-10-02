
export class LekhRequestDto {
  constructor(
    public title: string = '',
    public content: string = '',
    public category: string = '0',
    public parent: string = '0',
    public bgc: string = '#FFFFFF',
    public txtc: string = '#000000',
    public access: string = 'PUBLIC',
    public priority: string = 'HIGH'
  ) {}
}
