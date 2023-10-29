async function viciousWeapon() {
   const targetActor = token.actor

   const hp = targetActor.system.attributes.hp.value
   const countDmg = new Roll("1d6")
   const dealDmg = await countDmg.evaluate()
   const overallDmg = dealDmg.result

   await targetActor.update({ "system.attributes.hp.value": hp - overallDmg })
}

viciousWeapon()
