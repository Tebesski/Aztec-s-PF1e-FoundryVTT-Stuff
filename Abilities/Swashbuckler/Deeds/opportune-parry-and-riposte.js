const panache = actor.items.get(actor.system.resources.classFeat_panache._id)

const reflex = actor.items.get(actor.system.resources.combatReflexes._id)

const ref = actor.items.getName("Combat Reflexes").system.uses.value
const pan = actor.items.getName("Panache").system.uses.value

if (ref > 0 && pan > 0) {
   panache.addCharges(-1)
   reflex.addCharges(-1)
} else {
   return
}
