//取得模組所有匯出項目，包成變數com的成員
import * as com from "./Common";
 
class DomOutput implements com.IOutput {
    Write(msg: com.Message) {
        var div = $("<div></div>");
        div.text(`${msg.Time.toLocaleTimeString()} ${msg.Text }`);
        div.appendTo("body");
    }
}
 
//各模組可export相同名稱項目
export const Version = "DomOutput 1.0";
 
//export為預設項目，import時可直接引用
export default DomOutput;