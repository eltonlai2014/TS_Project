import { IOutput, Message } from "./Common";

class ConsoleOutput implements IOutput {
    Write(msg: Message) {
        console.log(`${msg.Time.toLocaleTimeString()} ${msg.Text}`);
    }
}

//各模組可export相同名稱項目
export const Version = "ConsoleOutput 1.0";

export { ConsoleOutput, Message };