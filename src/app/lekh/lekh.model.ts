export interface LekhResponse {
  success: boolean;
  message: string | null;
  error: string | null;
  timestamp: string;
  status: string;
  data: {
    title: string;
    content: {
      id: string;
      content: string;
      createdTime: string;
      updatedTime: string | null;
      createdBy: number;
      updatedBy: number | null;
    };
    comments: any;
    likes: any;
    created_time: string;
    updated_time: string | null;
  };
}
