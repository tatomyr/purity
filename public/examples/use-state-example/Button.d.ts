export declare type Actions = 'inc' | 'dec' | 'reset';
export declare type ButtonProps = {
    action: Actions;
    caption: string;
    handleClick: EventHandlerNonNull;
};
export declare const Button: ({ action, caption, handleClick }: ButtonProps) => string;
