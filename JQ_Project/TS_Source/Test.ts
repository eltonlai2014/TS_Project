import { DomOutput } from "./Dom";
import { ConsoleOutput, Message } from "./Console";

var c = new ConsoleOutput();
c.Write(new Message("console test"));
var d = new DomOutput();
d.Write(new Message("dom test"));