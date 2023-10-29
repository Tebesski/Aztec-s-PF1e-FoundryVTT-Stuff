const targetMacro = "applyBuff"
const params = "toggle Smiting to me at @attributes.hd.total"
window.macroChain = window.macroChain?.concat([params]) ?? [params]
game.macros.find((o) => o.name == targetMacro)?.execute()

const judgement = actor.items
   .get(actor.system.resources.classFeat_judgment._id)
   .addCharges(-1)
