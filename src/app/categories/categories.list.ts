interface Category {
  id: number;
  name: string;
  description: string;
  createdBy: number;
  createdDate: string;
  deactivatedDate: string | null;
  active: boolean;
}

interface CategoryResponse {
  success: boolean;
  message: string | null;
  error: string | null;
  timestamp: string;
  status: string;
  data: Category[];
}
