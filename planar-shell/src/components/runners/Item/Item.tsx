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
              <T title="acvalue" value={x.acvalue} />
              <T title="amount" value={x.amount} />
              <T title="amountSpellsToAdd" value={x.amountSpellsToAdd} />
              <T title="attackType" value={x.attackType} />
              <T title="berserkType" value={x.berserkType} />
              <T title="bonusTo" value={x.bonusTo} />
              <T title="castAtLevel" value={x.castAtLevel} />
              <T title="color" value={x.color} />
              <T title="condition" value={x.condition} />
              <T title="cycleSpeed" value={x.cycleSpeed} />
              <T title="damageType" value={x.damageType} />
              <T title="descriptionNoteTlk" value={x.descriptionNoteTlk} />
              <T title="direction" value={x.direction} />
              <T title="effect" value={x.effect} />
              <T title="embalmingType" value={x.embalmingType} />
              <T title="fadeAmount" value={x.fadeAmount} />
              <T title="flags" value={x.flags} />
              <T title="hasteType" value={x.hasteType} />
              <T title="healFlags" value={x.healFlags} />
              <T title="hpAmount" value={x.hpAmount} />
              <T title="icon" value={x.icon} />
              <T title="idsTarget" value={x.idsTarget} />
              <T title="idsValue" value={x.idsValue} />
              <T title="imagesCount" value={x.imagesCount} />
              <T title="invisibilityType" value={x.invisibilityType} />
              <T title="location" value={x.location} />
              <T title="maximumEnchantment" value={x.maximumEnchantment} />
              <T title="method" value={x.method} />
              <T title="mode" value={x.mode} />
              <T title="modifierType" value={x.modifierType} />
              <T title="panicType" value={x.panicType} />
              <T title="particleEffect" value={x.particleEffect} />
              <T title="playwhere" value={x.playwhere} />
              <T title="poisonType" value={x.poisonType} />
              <T title="projectile" value={x.projectile} />
              <T title="regenerationType" value={x.regenerationType} />
              <T title="resource" value={x.resource} />
              <T title="sequence" value={x.sequence} />
              <T title="spe" value={x.spe} />
              <T title="spellLevels" value={x.spellLevels} />
              <T title="statValue" value={x.statValue} />
              <T title="strength" value={x.strength} />
              <T title="stringRef" value={x.stringRef} />
              <T title="stringTlk" value={x.stringTlk} />
              <T title="value" value={x.value} />
              <T title="visualEffect" value={x.visualEffect} />
              <T title="weaponType" value={x.weaponType} />
            </AccordionDetails>
          </Accordion>
        ))
      }
    </div>
  );
};

export default Item;
