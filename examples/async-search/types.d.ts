export declare type Item = {
    id: number;
    name: string;
};
export declare type AppState = {
    input: string;
    items: Item[];
    isLoading: boolean;
    error: string;
    chosenItems: Item[];
};
