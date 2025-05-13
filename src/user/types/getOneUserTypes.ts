export type GetOneUserResponse = {
    id: number;
    nickName: string;
    email: string;
    firstName?: String | null;
    lastName?: String | null;
    midName?: String | null;
    isApproved: boolean;
};

export type GetPublicUserResponse = Omit<GetOneUserResponse, 'isApproved'>;
