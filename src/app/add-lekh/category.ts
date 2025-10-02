

interface Category {
  id: number;
  name: string;
  description: string;
  createdBy: number;
  createdDate: string;
  deactivatedDate: string | null;
  active: boolean;
}
