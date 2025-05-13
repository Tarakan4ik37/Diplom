export type GetOneUserResponse = {
    id: number;
    nickName: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    midName?: string | null;
    isApproved: boolean;
};

export type GetPublicUserResponse = Omit<GetOneUserResponse, 'isApproved'>;
