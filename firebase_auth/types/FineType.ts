export type FineType = {
    _id: string;
    userId: string;
    amount: number;
    reason: string;
    status: "pending" | "paid";
    createdAt: string;
    updatedAt: string;
  };
  