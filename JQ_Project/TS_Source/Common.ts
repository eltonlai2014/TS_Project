export class Message {
    Time: Date = new Date();
    Text: string;
    constructor(text: string) {
        this.Text = text;
    }
}
 
export interface IOutput {
    Write(msg: Message):void;
}