import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useItemStore } from './store/itemStore';
import { useItemWidgetBridge } from './useItemWidgetBridge';
import { useTranslation } from 'react-i18next';
import { useItemTalk } from './useItemTalk';
import Grid from '@mui/material/Grid';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Item.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline className={styles.p} disabled variant="standard" label={title} value={value} />;

const Item: FC = () => {
  const { t } = useTranslation();
  useItemWidgetBridge();
  const { startTalk, checkCanTalk, talking } = useItemTalk();
  const [canTalk, setCanTalk] = useState(false);

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'item');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    // loading,
    translatedItem,
    disposeItem,
  } = useItemStore(useShallow(state => ({
    // loading: state.loading, // TODO [snow]: pass into <T>...</T> to show loader inside TextFields
    translatedItem: state.translatedItem,
    loadItem: state.loadItem,
    disposeItem: state.disposeItem,
  })));

  useEffect(() => () => disposeItem(), []);

  useEffect(() => {
    checkCanTalk().then(x => setCanTalk(x)).catch(() => setCanTalk(false));
  }, [translatedItem]);

  if (!translatedItem) return null;

  return (
    <div>
      <div className={styles.actions}>
        <Button
          disabled={!canTalk || talking}
          onClick={() => { startTalk().catch(e => console.error(e)); }}
        >
          {t('run.item.talk')}
        </Button>
      </div>

      <Grid container spacing="1em">
        <Grid size={{ md: 6, xs: 12 }}>
          <T title={translatedItem.unidentifiedNameTlk} value={translatedItem.identifiedNameTlk} />
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField fullWidth multiline className={styles.p} disabled variant="standard" label={t('run.item.unidentifiedDescriptionTlk')} value={translatedItem.unidentifiedDescriptionTlk} />
          <TextField fullWidth multiline className={styles.p} disabled variant="standard" label={t('run.item.identifiedDescriptionTlk')} value={translatedItem.identifiedDescriptionTlk} />
        </Grid>
      </Grid>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.item.properties')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title={translatedItem.unidentifiedNameTlk} value={translatedItem.identifiedNameTlk} />

          <T title="dropSound" value={translatedItem.dropSound} />
          <T title="flags" value={translatedItem.flags?.join(', ')} />
          <T title="category" value={translatedItem.category} />
          <T title="unusableBy" value={translatedItem.unusableBy?.join(', ')} />
          <T title="equippedAppearance" value={translatedItem.equippedAppearance} />
          <T title="minLevel" value={translatedItem.minLevel} />
          <T title="minStrength" value={translatedItem.minStrength} />
          <T title="minStrengthBonus" value={translatedItem.minStrengthBonus} />
          <T title="kitUsability1" value={translatedItem.kitUsability1?.join(', ')} />
          <T title="minIntelligence" value={translatedItem.minIntelligence} />
          <T title="kitUsability2" value={translatedItem.kitUsability2?.join(', ')} />
          <T title="minDexterity" value={translatedItem.minDexterity} />
          <T title="kitUsability3" value={translatedItem.kitUsability3?.join(', ')} />
          <T title="minWisdom" value={translatedItem.minWisdom} />
          <T title="kitUsability4" value={translatedItem.kitUsability4?.join(', ')} />
          <T title="minConstitution" value={translatedItem.minConstitution} />
          <T title="weaponProficiency" value={translatedItem.weaponProficiency} />
          <T title="minCharisma" value={translatedItem.minCharisma} />
          <T title="price" value={translatedItem.price} />
          <T title="maxInStack" value={translatedItem.maxInStack} />
          <T title="inventoryIcon" value={translatedItem.inventoryIcon} />
          <T title="loreToId" value={translatedItem.loreToId} />
          <T title="groundIcon" value={translatedItem.groundIcon} />
          <T title="weight" value={translatedItem.weight} />
          <T title="pickupSound" value={translatedItem.pickupSound} />
          <T title="enchantment" value={translatedItem.enchantment} />
        </AccordionDetails>
      </Accordion>

      {
        // I may use here 'i' as key, because order is hardcoded in the format
        translatedItem.abilities.map((x, i) => (
          <Accordion key={`item_ability_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {t('run.item.abilities')}
                {' '}
                {i}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <T title="attackType" value={x.attackType} />
              <T title="typeFlags" value={x.typeFlags?.join(', ')} />
              <T title="abilityLocation" value={x.abilityLocation} />
              <T title="alternativeDiceSides" value={x.alternativeDiceSides} />
              <T title="useIcon" value={x.useIcon} />
              <T title="targetType" value={x.targetType} />
              <T title="targetCount" value={x.targetCount} />
              <T title="range" value={x.range} />
              <T title="projectileType" value={x.projectileType} />
              <T title="alternativeDiceThrown" value={x.alternativeDiceThrown} />
              <T title="speed" value={x.speed} />
              <T title="alternativeDamageBonus" value={x.alternativeDamageBonus} />
              <T title="thac0bonus" value={x.thac0bonus} />
              <T title="diceSides" value={x.diceSides} />
              <T title="primaryType" value={x.primaryType} />
              <T title="diceThrown" value={x.diceThrown} />
              <T title="secondaryType" value={x.secondaryType} />
              <T title="damageBonus" value={x.damageBonus} />
              <T title="damageType" value={x.damageType} />
              <T title="countOfEffects" value={x.countOfEffects} />
              <T title="firstEffectIndex" value={x.firstEffectIndex} />
              <T title="charges" value={x.charges} />
              <T title="chargeDepletionBehaviour" value={x.chargeDepletionBehaviour} />
              <T title="flags" value={x.flags?.join(', ')} />
              <T title="projectileAnimation" value={x.projectileAnimation} />
              <T title="overhandSwingAnimation" value={x.overhandSwingAnimation} />
              <T title="backhandSwingAnimation" value={x.backhandSwingAnimation} />
              <T title="thrustAnimation" value={x.thrustAnimation} />
              <T title="isArrow" value={x.isArrow} />
              <T title="isBolt" value={x.isBolt} />
              <T title="isBullet" value={x.isBullet} />
              {/* TODO [snow]: map ability.effect */}
            </AccordionDetails>
          </Accordion>
        ))
      }

      {
        // I may use here 'i' as key, because order is hardcoded in the format
        translatedItem.effects.map((x, i) => (
          <Accordion key={`item_effect_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {t('run.item.effects')}
                {' '}
                {i}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <T title="opcode" value={x.opcode} />
              <T title="target" value={x.target} />
              <T title="power" value={x.power} />
              <T title="timingMode" value={x.timingMode} />
              <T title="dispelOrResistance" value={x.dispelOrResistance} />
              <T title="duration" value={x.duration} />
              <T title="probability1" value={x.probability1} />
              <T title="probability2" value={x.probability2} />
              <T title="diceThrownCountOrMaximumLevel" value={x.diceThrownCountOrMaximumLevel} />
              <T title="diceSidesOrMinimumLevel" value={x.diceSidesOrMinimumLevel} />
              <T title="savingThrowType" value={x.savingThrowType?.join(', ')} />
              <T title="savingThrowBonus" value={x.savingThrowBonus} />
              {
                x.opcode === 'acBonus' && (
                  <>
                    <T title="acvalue" value={x.acvalue} />
                    <T title="bonusTo" value={x.bonusTo} />
                    <T title="spe" value={x.spe} />
                  </>
                )
              }
              {x.opcode === 'modifyAttacksPerRound' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'berserk' && (
                <>
                  <T title="berserkType" value={x.berserkType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'charismaBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'setColor' && (
                <>
                  <T title="color" value={x.color} />
                  <T title="location" value={x.location} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'setColorGlowPulse' && (
                <>
                  <T title="color" value={x.color} />
                  <T title="location" value={x.location} />
                  <T title="cycleSpeed" value={x.cycleSpeed} />
                  ;
                </>
              )}

              {x.opcode === 'consitutionBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'curePoison' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'damage' && (
                <>
                  <T title="amount" value={x.amount} />
                  <T title="mode" value={x.mode} />
                  <T title="damageType" value={x.damageType} />
                  <T title="flags" value={x.flags} />
                  ;
                </>
              )}

              {x.opcode === 'dexterityBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'haste' && (
                <>
                  <T title="hasteType" value={x.hasteType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'currentHpBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="healFlags" value={x.healFlags} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'maximumHpBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="mode" value={x.mode} />
                  ;
                </>
              )}

              {x.opcode === 'intelligenceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'invisibility' && (
                <>
                  <T title="invisibilityType" value={x.invisibilityType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'loreBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'luckBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'moraleBonus' && (
                <>
                  <T title="mode" value={x.mode} />
                  ;
                </>
              )}

              {x.opcode === 'panic' && (
                <>
                  <T title="panicType" value={x.panicType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'poison' && (
                <>
                  <T title="amount" value={x.amount} />
                  <T title="poisonType" value={x.poisonType} />
                  <T title="icon" value={x.icon} />
                  ;
                </>
              )}

              {x.opcode === 'acidResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'coldResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'electricityResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'fireResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'saveVsDeathBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'saveVsWandBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'saveVsPolymorphBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'saveVsBreathBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'saveVsSpellBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'silence' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'sparkle' && (
                <>
                  <T title="amount" value={x.amount} />
                  <T title="particleEffect" value={x.particleEffect} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'bonusWizardSpell' && (
                <>
                  <T title="amountSpellsToAdd" value={x.amountSpellsToAdd} />
                  <T title="spellLevels" value={x.spellLevels} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'strengthBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'stun' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'wisdomBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'baseThac0Bonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'moveSilentlyBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'bonusPriestSpell' && (
                <>
                  <T title="amountSpellsToAdd" value={x.amountSpellsToAdd} />
                  <T title="spellLevels" value={x.spellLevels} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'blur' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'translucency' && (
                <>
                  <T title="fadeAmount" value={x.fadeAmount} />
                  <T title="visualEffect" value={x.visualEffect} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'attackDamageBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'blindness' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'immunityToProjectile' && (
                <>
                  <T title="projectile" value={x.projectile} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'magicalFireResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'magicalColdResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'slashingResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'crushingResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'piercingResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'missileResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'openLockBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'findTrapBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'pickPocketBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'fatigueBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'intoxicationBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'exceptionalStrengthBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'regeneration' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="regenerationType" value={x.regenerationType} />
                  <T title="icon" value={x.icon} />
                  ;
                </>
              )}

              {x.opcode === 'immunityToEffect' && (
                <>
                  <T title="effect" value={x.effect} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'xpBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'removeGold' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'moraleBreak' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'paralyze' && (
                <>
                  <T title="idsValue" value={x.idsValue} />
                  <T title="idsTarget" value={x.idsTarget} />
                  <T title="effect" value={x.effect} />
                  ;
                </>
              )}

              {x.opcode === 'immunityToWeapons' && (
                <>
                  <T title="maximumEnchantment" value={x.maximumEnchantment} />
                  <T title="weaponType" value={x.weaponType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'confusion' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'setAnimationSequence' && (
                <>
                  <T title="sequence" value={x.sequence} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'castSpell' && (
                <>
                  <T title="castAtLevel" value={x.castAtLevel} />
                  <T title="mode" value={x.mode} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'learnSpell' && (
                <>
                  resource: string;
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'castSpellAtPoint' && (
                <>
                  <T title="castAtLevel" value={x.castAtLevel} />
                  <T title="mode" value={x.mode} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'mirrorImageEffect' && (
                <>
                  <T title="imagesCount" value={x.imagesCount} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'removeFear' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'magicResistanceBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'preventPortraitIcon' && (
                <>
                  <T title="icon" value={x.icon} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {
                x.opcode === 'poisonResistanceBonus' && (
                  <>
                    <T title="value" value={x.value} />
                    <T title="spe" value={x.spe} />
                  </>
                )
              }

              {x.opcode === 'playSound' && (
                <>
                  resource: string;
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'protectionmFromSpell' && (
                <>
                  stringTlk: string; resource: string;
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'minimumHp' && (
                <>
                  <T title="hpAmount" value={x.hpAmount} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'playVisualEffect' && (
                <>
                  <T title="playwhere" value={x.playwhere} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'disableDisplayString' && (
                <>
                  stringTlk: string;
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'shakeScreen' && (
                <>
                  <T title="strength" value={x.strength} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'thac0Bonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="modifierType" value={x.modifierType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'immunityToSpecificAnimation' && (
                <>
                  resource: string;
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'immunityToTurnUndead' && (
                <>
                  <T title="statValue" value={x.statValue} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'criticalHitBonus' && (
                <>
                  <T title="value" value={x.value} />
                  <T title="condition" value={x.condition} />
                  <T title="attackType" value={x.attackType} />
                  ;
                </>
              )}

              {x.opcode === 'restrictItem' && (
                <>
                  <T title="idsTarget" value={x.idsTarget} />
                  ; descriptionNoteTlk: string;
                </>
              )}

              {x.opcode === 'flashScreen' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'soulExodus' && (
                <>
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'playBamFile' && (
                <>
                  <T title="color" value={x.color} />
                  <T title="method" value={x.method} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'embalm' && (
                <>
                  <T title="embalmingType" value={x.embalmingType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}

              {x.opcode === 'hitPointTransfer' && (
                <>
                  <T title="amount" value={x.amount} />
                  <T title="direction" value={x.direction} />
                  <T title="damageType" value={x.damageType} />
                  <T title="spe" value={x.spe} />
                  ;
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      }
    </div>
  );
};

export default Item;
