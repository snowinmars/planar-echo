import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useCreatureStore } from './store/creatureStore';
import { useCreatureWidgetBridge } from './useCreatureWidgetBridge';
import { useTranslation } from 'react-i18next';
import { useCreatureTalk } from './useCreatureTalk';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Character.module.scss';

type TProps = Readonly<{
  title: string;
  value: string | number;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField className={styles.p} disabled variant="standard" label={title} value={value} />;

const Creature: FC = () => {
  const { t } = useTranslation();
  useCreatureWidgetBridge();
  const { startTalk, talking } = useCreatureTalk();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'creature');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    // loading,
    translatedCreature,
    disposeCreature,
  } = useCreatureStore(useShallow(state => ({
    // loading: state.loading, // TODO [snow]: pass into <T>...</T> to show loader inside TextFields
    translatedCreature: state.translatedCreature,
    loadCreature: state.loadCreature,
    disposeCreature: state.disposeCreature,
  })));

  useEffect(() => () => disposeCreature(), []);

  if (!translatedCreature) return null;

  return (
    <div>
      <div className={styles.actions}>
        <Button
          disabled={talking}
          onClick={() => { startTalk().catch(e => console.error(e)); }}
        >
          {t('run.creature.talk')}
        </Button>
      </div>

      <T title={translatedCreature.tooltipTlk} value={translatedCreature.nameTlk} />
      <T title={t('run.creature.hp')} value={`${translatedCreature.currentHp}/${translatedCreature.maximumHp}`} />
      <T title={t('run.creature.sex')} value={translatedCreature.sex} />
      <T title={t('run.creature.race')} value={translatedCreature.race} />
      <T title={t('run.creature.theClass')} value={translatedCreature.theClass} />
      <T title={t('run.creature.gender')} value={translatedCreature.gender} />

      {/* TODO [snow]: render portraits */}
      <T title="smallPortrait" value={translatedCreature.smallPortrait} />
      <T title="largePortrait" value={translatedCreature.largePortrait} />

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.characteristics')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          { !translatedCreature.strengthPercentageBonus && <T title={t('run.creature.strength')} value={translatedCreature.strength} />}
          { !!translatedCreature.strengthPercentageBonus && <T title={t('run.creature.strength')} value={`${translatedCreature.strength}/${translatedCreature.strengthPercentageBonus}`} />}
          <T title={t('run.creature.intelligence')} value={translatedCreature.intelligence} />
          <T title={t('run.creature.wisdom')} value={translatedCreature.wisdom} />
          <T title={t('run.creature.dexterity')} value={translatedCreature.dexterity} />
          <T title={t('run.creature.constitution')} value={translatedCreature.constitution} />
          <T title={t('run.creature.charisma')} value={translatedCreature.charisma} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.fightCharacteristics')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title={t('run.creature.naturalAc')} value={translatedCreature.naturalAc} />
          <T title={t('run.creature.effectiveAc')} value={translatedCreature.effectiveAc} />
          <T title={t('run.creature.thac0')} value={translatedCreature.thac0} />
          <T title={t('run.creature.numberOfAttacksPerRound')} value={translatedCreature.numberOfAttacksPerRound} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.secondaryAbilities')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title={t('run.creature.hideInShadows')} value={translatedCreature.hideInShadows} />
          <T title={t('run.creature.detectIllusion')} value={translatedCreature.detectIllusion} />
          <T title={t('run.creature.setTraps')} value={translatedCreature.setTraps} />
          <T title={t('run.creature.lore')} value={translatedCreature.lore} />
          <T title={t('run.creature.lockpicking')} value={translatedCreature.lockpicking} />
          <T title={t('run.creature.moveSilently')} value={translatedCreature.moveSilently} />
          <T title={t('run.creature.findOrDisarmTraps')} value={translatedCreature.findOrDisarmTraps} />
          <T title={t('run.creature.pickPockets')} value={translatedCreature.pickPockets} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.other')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="flags" value={translatedCreature.flags?.join(', ')} />
          <T title="xpGainedForKilling" value={translatedCreature.xpGainedForKilling} />
          <T title="powerLevelOrXp" value={translatedCreature.powerLevelOrXp} />
          <T title="goldCarried" value={translatedCreature.goldCarried} />
          <T title="status" value={translatedCreature.status?.join(', ')} />
          <T title="animationId" value={translatedCreature.animationId} />
          <T title="effectVersion" value={translatedCreature.effectVersion} />
          <T title="reputation" value={translatedCreature.reputation} />
          <T title="fatigue" value={translatedCreature.fatigue} />
          <T title="intoxication" value={translatedCreature.intoxication} />
          <T title="luck" value={translatedCreature.luck} />
          <T title="availableInventorySlotsCount" value={translatedCreature.availableInventorySlotsCount} />
          <T title="nightmareModeModifiersApplied" value={translatedCreature.nightmareModeModifiersApplied} />
          <T title="translucency" value={translatedCreature.translucency} />
          <T title="murderIncrementBy" value={translatedCreature.murderIncrementBy} />
          <T title="turnUndeadLevel" value={translatedCreature.turnUndeadLevel} />
          <T title="tracking" value={translatedCreature.tracking} />
          <T title="faction" value={translatedCreature.faction} />
          <T title="team" value={translatedCreature.team} />
          <T title="species" value={translatedCreature.species} />
          <T title="dialogueActivationRange" value={translatedCreature.dialogueActivationRange} />
          <T title="collisionRadius" value={translatedCreature.collisionRadius} />
          <T title="shieldFlags" value={translatedCreature.shieldFlags?.join(', ')} />
          <T title="fieldOfVision" value={translatedCreature.fieldOfVision} />
          <T title="attributes" value={translatedCreature.attributes?.join(', ')} />
          <T title="levelFirstClass" value={translatedCreature.levelFirstClass} />
          <T title="levelSecondClass" value={translatedCreature.levelSecondClass} />
          <T title="levelThirdClass" value={translatedCreature.levelThirdClass} />
          <T title="morale" value={translatedCreature.morale} />
          <T title="moraleBreak" value={translatedCreature.moraleBreak} />
          <T title="racialEnemy" value={translatedCreature.racialEnemy} />
          <T title="moraleRecoveryTime" value={translatedCreature.moraleRecoveryTime} />
          <T title="deity" value={translatedCreature.deity} />
          <T title="mageType" value={translatedCreature.mageType?.join(', ')} />
          <T title="allegiance" value={translatedCreature.allegiance} />
          <T title="general" value={translatedCreature.general} />
          <T title="specific" value={translatedCreature.specific} />
          <T title="objectSpecs" value={translatedCreature.objectSpecs?.join(', ')} />
          <T title="alignment" value={translatedCreature.alignment} />
          <T title="globalIdentifier" value={translatedCreature.globalIdentifier} />
          <T title="localIdentifier" value={translatedCreature.localIdentifier} />
          <T title="dialogueRef" value={translatedCreature.dialogueRef} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.acModifier')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="crushingAcModifier" value={translatedCreature.crushingAcModifier} />
          <T title="missileAcModifier" value={translatedCreature.missileAcModifier} />
          <T title="piercingAcModifier" value={translatedCreature.piercingAcModifier} />
          <T title="slashingAcModifier" value={translatedCreature.slashingAcModifier} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.saveVersus')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="saveVersusDeath" value={translatedCreature.saveVersusDeath} />
          <T title="saveVersusWands" value={translatedCreature.saveVersusWands} />
          <T title="saveVersusPolymorph" value={translatedCreature.saveVersusPolymorph} />
          <T title="saveVersusBreath" value={translatedCreature.saveVersusBreath} />
          <T title="saveVersusSpells" value={translatedCreature.saveVersusSpells} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.resistances')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="fireResistance" value={translatedCreature.fireResistance} />
          <T title="coldResistance" value={translatedCreature.coldResistance} />
          <T title="electricityResistance" value={translatedCreature.electricityResistance} />
          <T title="acidResistance" value={translatedCreature.acidResistance} />
          <T title="magicResistance" value={translatedCreature.magicResistance} />
          <T title="magicFireResistance" value={translatedCreature.magicFireResistance} />
          <T title="magicColdResistance" value={translatedCreature.magicColdResistance} />
          <T title="slashingResistance" value={translatedCreature.slashingResistance} />
          <T title="crushingResistance" value={translatedCreature.crushingResistance} />
          <T title="piercingResistance" value={translatedCreature.piercingResistance} />
          <T title="missileResistance" value={translatedCreature.missileResistance} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.proficiencies')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="largeSwordProficiency" value={translatedCreature.largeSwordProficiency} />
          <T title="smallSwordProficiency" value={translatedCreature.smallSwordProficiency} />
          <T title="bowProficiency" value={translatedCreature.bowProficiency} />
          <T title="spearProficiency" value={translatedCreature.spearProficiency} />
          <T title="bluntProficiency" value={translatedCreature.bluntProficiency} />
          <T title="spikedProficiency" value={translatedCreature.spikedProficiency} />
          <T title="axeProficiency" value={translatedCreature.axeProficiency} />
          <T title="missileProficiency" value={translatedCreature.missileProficiency} />
          <T title="unusedProficiency1" value={translatedCreature.unusedProficiency1} />
          <T title="unusedProficiency2" value={translatedCreature.unusedProficiency2} />
          <T title="unusedProficiency3" value={translatedCreature.unusedProficiency3} />
          <T title="unusedProficiency4" value={translatedCreature.unusedProficiency4} />
          <T title="unusedProficiency5" value={translatedCreature.unusedProficiency5} />
          <T title="unspentProficiencies" value={translatedCreature.unspentProficiencies} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.scripts')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="overrideScriptRef" value={translatedCreature.overrideScriptRef} />
          <T title="classScriptRef" value={translatedCreature.classScriptRef} />
          <T title="raceScriptRef" value={translatedCreature.raceScriptRef} />
          <T title="generalScriptRef" value={translatedCreature.generalScriptRef} />
          <T title="defaultScriptRef" value={translatedCreature.defaultScriptRef} />
          <T title="scriptName" value={translatedCreature.scriptName} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.colourIndex')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="metalColourIndex" value={translatedCreature.metalColourIndex} />
          <T title="minorColourIndex" value={translatedCreature.minorColourIndex} />
          <T title="majorColourIndex" value={translatedCreature.majorColourIndex} />
          <T title="skinColourIndex" value={translatedCreature.skinColourIndex} />
          <T title="leatherColourIndex" value={translatedCreature.leatherColourIndex} />
          <T title="armorColourIndex" value={translatedCreature.armorColourIndex} />
          <T title="hairColourIndex" value={translatedCreature.hairColourIndex} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.soundsTitle')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="initialMeetingSoundTlk" value={translatedCreature.initialMeetingSoundTlk} />
          <T title="moraleSoundTlk" value={translatedCreature.moraleSoundTlk} />
          <T title="happySoundTlk" value={translatedCreature.happySoundTlk} />
          <T title="unhappyAnnoyedSoundTlk" value={translatedCreature.unhappyAnnoyedSoundTlk} />
          <T title="unhappySeriousSoundTlk" value={translatedCreature.unhappySeriousSoundTlk} />
          <T title="unhappyBreakingPointSoundTlk" value={translatedCreature.unhappyBreakingPointSoundTlk} />
          <T title="leaderSoundTlk" value={translatedCreature.leaderSoundTlk} />
          <T title="tiredSoundTlk" value={translatedCreature.tiredSoundTlk} />
          <T title="boredSoundTlk" value={translatedCreature.boredSoundTlk} />
          <T title="battleCry1SoundTlk" value={translatedCreature.battleCry1SoundTlk} />
          <T title="battleCry2SoundTlk" value={translatedCreature.battleCry2SoundTlk} />
          <T title="battleCry3SoundTlk" value={translatedCreature.battleCry3SoundTlk} />
          <T title="battleCry4SoundTlk" value={translatedCreature.battleCry4SoundTlk} />
          <T title="battleCry5SoundTlk" value={translatedCreature.battleCry5SoundTlk} />
          <T title="attack1SoundTlk" value={translatedCreature.attack1SoundTlk} />
          <T title="attack2SoundTlk" value={translatedCreature.attack2SoundTlk} />
          <T title="attack3SoundTlk" value={translatedCreature.attack3SoundTlk} />
          <T title="attack4SoundTlk" value={translatedCreature.attack4SoundTlk} />
          <T title="damageSoundTlk" value={translatedCreature.damageSoundTlk} />
          <T title="dyingSoundTlk" value={translatedCreature.dyingSoundTlk} />
          <T title="hurtSoundTlk" value={translatedCreature.hurtSoundTlk} />
          <T title="areaForestSoundTlk" value={translatedCreature.areaForestSoundTlk} />
          <T title="areaCitySoundTlk" value={translatedCreature.areaCitySoundTlk} />
          <T title="areaDungeonSoundTlk" value={translatedCreature.areaDungeonSoundTlk} />
          <T title="areaDaySoundTlk" value={translatedCreature.areaDaySoundTlk} />
          <T title="areaNightSoundTlk" value={translatedCreature.areaNightSoundTlk} />
          <T title="selectCommon1SoundTlk" value={translatedCreature.selectCommon1SoundTlk} />
          <T title="selectCommon2SoundTlk" value={translatedCreature.selectCommon2SoundTlk} />
          <T title="selectCommon3SoundTlk" value={translatedCreature.selectCommon3SoundTlk} />
          <T title="selectCommon4SoundTlk" value={translatedCreature.selectCommon4SoundTlk} />
          <T title="selectCommon5SoundTlk" value={translatedCreature.selectCommon5SoundTlk} />
          <T title="selectCommon6SoundTlk" value={translatedCreature.selectCommon6SoundTlk} />
          <T title="selectAction1SoundTlk" value={translatedCreature.selectAction1SoundTlk} />
          <T title="selectAction2SoundTlk" value={translatedCreature.selectAction2SoundTlk} />
          <T title="selectAction3SoundTlk" value={translatedCreature.selectAction3SoundTlk} />
          <T title="selectAction4SoundTlk" value={translatedCreature.selectAction4SoundTlk} />
          <T title="selectAction5SoundTlk" value={translatedCreature.selectAction5SoundTlk} />
          <T title="selectAction6SoundTlk" value={translatedCreature.selectAction6SoundTlk} />
          <T title="selectAction7SoundTlk" value={translatedCreature.selectAction7SoundTlk} />
          <T title="interaction1SoundTlk" value={translatedCreature.interaction1SoundTlk} />
          <T title="interaction2SoundTlk" value={translatedCreature.interaction2SoundTlk} />
          <T title="interaction3SoundTlk" value={translatedCreature.interaction3SoundTlk} />
          <T title="interaction4SoundTlk" value={translatedCreature.interaction4SoundTlk} />
          <T title="interaction5SoundTlk" value={translatedCreature.interaction5SoundTlk} />
          <T title="insult1SoundTlk" value={translatedCreature.insult1SoundTlk} />
          <T title="insult2SoundTlk" value={translatedCreature.insult2SoundTlk} />
          <T title="insult3SoundTlk" value={translatedCreature.insult3SoundTlk} />
          <T title="compliment1SoundTlk" value={translatedCreature.compliment1SoundTlk} />
          <T title="compliment2SoundTlk" value={translatedCreature.compliment2SoundTlk} />
          <T title="compliment3SoundTlk" value={translatedCreature.compliment3SoundTlk} />
          <T title="special1SoundTlk" value={translatedCreature.special1SoundTlk} />
          <T title="special2SoundTlk" value={translatedCreature.special2SoundTlk} />
          <T title="special3SoundTlk" value={translatedCreature.special3SoundTlk} />
          <T title="reactToDieGeneralSoundTlk" value={translatedCreature.reactToDieGeneralSoundTlk} />
          <T title="reactToDieSpecificSoundTlk" value={translatedCreature.reactToDieSpecificSoundTlk} />
          <T title="responseToCompliment1SoundTlk" value={translatedCreature.responseToCompliment1SoundTlk} />
          <T title="responseToCompliment2SoundTlk" value={translatedCreature.responseToCompliment2SoundTlk} />
          <T title="responseToCompliment3SoundTlk" value={translatedCreature.responseToCompliment3SoundTlk} />
          <T title="responseToInsult1SoundTlk" value={translatedCreature.responseToInsult1SoundTlk} />
          <T title="responseToInsult2SoundTlk" value={translatedCreature.responseToInsult2SoundTlk} />
          <T title="responseToInsult3SoundTlk" value={translatedCreature.responseToInsult3SoundTlk} />
          <T title="dialogHostileSoundTlk" value={translatedCreature.dialogHostileSoundTlk} />
          <T title="dialogDefaultSoundTlk" value={translatedCreature.dialogDefaultSoundTlk} />
          <T title="selectRare1SoundTlk" value={translatedCreature.selectRare1SoundTlk} />
          <T title="selectRare2SoundTlk" value={translatedCreature.selectRare2SoundTlk} />
          <T title="criticalHitSoundTlk" value={translatedCreature.criticalHitSoundTlk} />
          <T title="criticalMissSoundTlk" value={translatedCreature.criticalMissSoundTlk} />
          <T title="targetImmuneSoundTlk" value={translatedCreature.targetImmuneSoundTlk} />
          <T title="inventoryFullSoundTlk" value={translatedCreature.inventoryFullSoundTlk} />
          <T title="pickedPicketSoundTlk" value={translatedCreature.pickedPicketSoundTlk} />
          <T title="hiddenInShadowsSoundTlk" value={translatedCreature.hiddenInShadowsSoundTlk} />
          <T title="spellDisruptedSoundTlk" value={translatedCreature.spellDisruptedSoundTlk} />
          <T title="setTrapSoundTlk" value={translatedCreature.setTrapSoundTlk} />
          <T title="existance4SoundTlk" value={translatedCreature.existance4SoundTlk} />
          <T title="bioSoundTlk" value={translatedCreature.bioSoundTlk} />
          <T title="sound1Tlk" value={translatedCreature.sound1Tlk} />
          <T title="sound2Tlk" value={translatedCreature.sound2Tlk} />
          <T title="sound3Tlk" value={translatedCreature.sound3Tlk} />
          <T title="sound4Tlk" value={translatedCreature.sound4Tlk} />
          <T title="sound5Tlk" value={translatedCreature.sound5Tlk} />
          <T title="sound6Tlk" value={translatedCreature.sound6Tlk} />
          <T title="sound7Tlk" value={translatedCreature.sound7Tlk} />
          <T title="sound8Tlk" value={translatedCreature.sound8Tlk} />
          <T title="sound9Tlk" value={translatedCreature.sound9Tlk} />
          <T title="sound10Tlk" value={translatedCreature.sound10Tlk} />
          <T title="sound11Tlk" value={translatedCreature.sound11Tlk} />
          <T title="sound12Tlk" value={translatedCreature.sound12Tlk} />
          <T title="sound13Tlk" value={translatedCreature.sound13Tlk} />
          <T title="sound14Tlk" value={translatedCreature.sound14Tlk} />
          <T title="sound15Tlk" value={translatedCreature.sound15Tlk} />
          <T title="sound16Tlk" value={translatedCreature.sound16Tlk} />
          <T title="sound17Tlk" value={translatedCreature.sound17Tlk} />
          <T title="sound18Tlk" value={translatedCreature.sound18Tlk} />
          <T title="sound19Tlk" value={translatedCreature.sound19Tlk} />
          <T title="sound20Tlk" value={translatedCreature.sound20Tlk} />
          <T title="sound21Tlk" value={translatedCreature.sound21Tlk} />
          <T title="sound22Tlk" value={translatedCreature.sound22Tlk} />
          <T title="sound23Tlk" value={translatedCreature.sound23Tlk} />
          <T title="sound24Tlk" value={translatedCreature.sound24Tlk} />
          <T title="sound25Tlk" value={translatedCreature.sound25Tlk} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.techInfo')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="knownSpellsOffset" value={translatedCreature.knownSpellsOffset} />
          <T title="knownSpellsCount" value={translatedCreature.knownSpellsCount} />
          <T title="spellMemorizationInfoOffset" value={translatedCreature.spellMemorizationInfoOffset} />
          <T title="spellMemorizationInfoEntriesCount" value={translatedCreature.spellMemorizationInfoEntriesCount} />
          <T title="memorizedSpellsOffset" value={translatedCreature.memorizedSpellsOffset} />
          <T title="memorizedSpellsCount" value={translatedCreature.memorizedSpellsCount} />
          <T title="offsetToItemSlots" value={translatedCreature.offsetToItemSlots} />
          <T title="offsetToItems" value={translatedCreature.offsetToItems} />
          <T title="countOfItems" value={translatedCreature.countOfItems} />
          <T title="offsetToEffects" value={translatedCreature.offsetToEffects} />
          <T title="countOfEffects" value={translatedCreature.countOfEffects} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Creature;
