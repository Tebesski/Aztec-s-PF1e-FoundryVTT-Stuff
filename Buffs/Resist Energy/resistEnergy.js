const targetMacro = "applyBuff"
const params = "deactivate Resist Energy from me"

const actor = await canvas.tokens.controlled[0].actor
const hp = await canvas.tokens.controlled[0].actor.system.attributes.hp
const resEnergy = await actor.items.getName("Resist Energy").system.uses.value

await Dialog.prompt({
   title: "Amount of damage:",
   content: `<input id='dmgInput' type='number' value='0' />`,
   label: "Apply",
   callback: (html, event) => main(html, event),
})

async function noRes() {
   await Dialog.confirm({
      title: "Resist Energy is dispersed!",
      buttons: {
         okay: {
            label: "Okay",
            icon: `<i class="fas fa-check"></i>`,
         },
      },
      default: "okay",
   })

   window.macroChain = window.macroChain?.concat([params]) ?? [params]
   game.macros.find((o) => o.name == targetMacro)?.execute()
   return
}

async function main(html) {
   let dmg = Number(html.find("input#dmgInput").val())

   if (dmg > resEnergy) {
      await actor.update({
         "system.attributes.hp.value": hp.value + resEnergy,
      })

      actor.items
         .get(actor.system.resources.resistEnergy._id)
         .addCharges(-resEnergy)

      noRes()
      return
   }

   await actor.update({
      "system.attributes.hp.value": hp.value + Math.min(dmg, 20),
   })

   actor.items
      .get(actor.system.resources.resistEnergy._id)
      .addCharges(-Math.min(20, dmg))

   if (resEnergy < 1) {
      noRes()
   }
}
