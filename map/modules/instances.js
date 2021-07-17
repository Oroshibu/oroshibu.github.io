import { Block, Entity } from "./classes.js";

var instances = {};

export default instances;

instances["void"] = new Block("0");
instances["wall"] = new Block("1");
instances["wall1"] = new Block("1");
instances["wall2"] = new Block("1");
instances["wall3"] = new Block("1");
instances["wall4"] = new Block("1");
instances["wall5"] = new Block("1");
instances["wall6"] = new Block("1");
instances["wall7"] = new Block("1");
instances["wall8"] = new Block("1");
instances["wall9"] = new Block("1");
instances["wall10"] = new Block("1");
instances["wall11"] = new Block("1");
instances["wall12"] = new Block("1");
instances["wall16"] = new Block("1");
instances["wall13"] = new Entity("1");
instances["wall14"] = new Entity("1");
instances["wall15"] = new Entity("1");
instances["wall33"] = new Entity("1", {x:0.5, y:0.5}, {x:1, y:1}, 0, "Others");
instances["wall34"] = new Entity("1", {x:0.5, y:0.5}, {x:1, y:1}, 0.5, "Gingus");
