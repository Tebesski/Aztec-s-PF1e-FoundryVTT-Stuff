if (state === false) {
   return
}

const barrier = actor.items.getName("Ablative Barrier")

await barrier.update({
   "system.uses.value": barrier.system.uses.value + barrier.system.uses.max,
})
