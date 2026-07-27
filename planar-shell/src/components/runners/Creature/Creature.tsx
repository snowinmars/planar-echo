import { useEffect } from 'react';
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
import { useTlkStore } from '@/engine/store/planarRuntime';
import { mapCreatureToTlkRefs } from './mapCreatureToTlkRefs';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Character.module.scss';

type TProps = Readonly<{
  title: string;
  value: string | number;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField className={styles.p} disabled variant="standard" label={title} value={value} />;

// TODO [snow]: extend with v11 props
const Creature: FC = () => {
  const { t } = useTranslation();
  useCreatureWidgetBridge();
  const { startTalk, talking } = useCreatureTalk();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'creature');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  // TODO [snow]: pass loading into <T>...</T> to show loader inside TextFields
  const currentCreature = useCreatureStore(x => x.currentCreature);
  const disposeCreature = useCreatureStore(x => x.disposeCreature);

  const lines = useTlkStore(x => x.lines);
  const loadTlkRefs = useTlkStore(x => x.loadTlkRefs);
  const tlk = (ref: number): string => lines.get(ref) ?? `… (${ref})`;

  useEffect(() => () => disposeCreature(), []);

  useEffect(() => {
    if (!currentCreature) return;
    const tlkRefs = mapCreatureToTlkRefs(currentCreature);
    loadTlkRefs(tlkRefs).catch((e: unknown) => console.error(e));
  }, [currentCreature, loadTlkRefs]);

  if (!currentCreature) return null;

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

      <T title={tlk(currentCreature.tooltipRef)} value={tlk(currentCreature.nameRef)} />
      <T title={t('run.creature.hp')} value={`${currentCreature.currentHp}/${currentCreature.maximumHp}`} />
      <T title={t('run.creature.sex')} value={currentCreature.sex} />
      <T title={t('run.creature.race')} value={currentCreature.race} />
      <T title={t('run.creature.theClass')} value={currentCreature.theClass} />
      <T title={t('run.creature.gender')} value={currentCreature.gender} />

      {/* TODO [snow]: render portraits */}
      <T title="smallPortrait" value={currentCreature.smallPortrait} />
      <T title="largePortrait" value={currentCreature.largePortrait} />

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.characteristics')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          { !currentCreature.strengthPercentageBonus && <T title={t('run.creature.strength')} value={currentCreature.strength} />}
          { !!currentCreature.strengthPercentageBonus && <T title={t('run.creature.strength')} value={`${currentCreature.strength}/${currentCreature.strengthPercentageBonus}`} />}
          <T title={t('run.creature.intelligence')} value={currentCreature.intelligence} />
          <T title={t('run.creature.wisdom')} value={currentCreature.wisdom} />
          <T title={t('run.creature.dexterity')} value={currentCreature.dexterity} />
          <T title={t('run.creature.constitution')} value={currentCreature.constitution} />
          <T title={t('run.creature.charisma')} value={currentCreature.charisma} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.fightCharacteristics')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title={t('run.creature.naturalAc')} value={currentCreature.naturalAc} />
          <T title={t('run.creature.effectiveAc')} value={currentCreature.effectiveAc} />
          <T title={t('run.creature.thac0')} value={currentCreature.thac0} />
          <T title={t('run.creature.numberOfAttacksPerRound')} value={currentCreature.numberOfAttacksPerRound} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.secondaryAbilities')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title={t('run.creature.hideInShadows')} value={currentCreature.hideInShadows} />
          {
            currentCreature.version === 'v1.0' && <T title={t('run.creature.detectIllusion')} value={currentCreature.detectIllusion} />
          }
          <T title={t('run.creature.setTraps')} value={currentCreature.setTraps} />
          <T title={t('run.creature.lore')} value={currentCreature.lore} />
          <T title={t('run.creature.lockpicking')} value={currentCreature.lockpicking} />
          <T title={t('run.creature.moveSilently')} value={currentCreature.moveSilently} />
          <T title={t('run.creature.findOrDisarmTraps')} value={currentCreature.findOrDisarmTraps} />
          <T title={t('run.creature.pickPockets')} value={currentCreature.pickPockets} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.other')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="flags" value={currentCreature.flags?.join(', ')} />
          <T title="xpGainedForKilling" value={currentCreature.xpGainedForKilling} />
          <T title="powerLevelOrXp" value={currentCreature.powerLevelOrXp} />
          <T title="goldCarried" value={currentCreature.goldCarried} />
          <T title="status" value={currentCreature.status?.join(', ')} />
          <T title="animationId" value={currentCreature.animationId} />
          <T title="effectVersion" value={currentCreature.effectVersion} />
          <T title="reputation" value={currentCreature.reputation} />
          <T title="fatigue" value={currentCreature.fatigue} />
          <T title="intoxication" value={currentCreature.intoxication} />
          <T title="luck" value={currentCreature.luck} />
          {
            currentCreature.version === 'v1.0' && (
              <>
                <T title="availableInventorySlotsCount" value={currentCreature.availableInventorySlotsCount} />
                <T title="nightmareModeModifiersApplied" value={currentCreature.nightmareModeModifiersApplied} />
                <T title="translucency" value={currentCreature.translucency} />
              </>
            )
          }
          <T title="murderIncrementBy" value={currentCreature.murderIncrementBy} />
          <T title="turnUndeadLevel" value={currentCreature.turnUndeadLevel} />
          <T title="tracking" value={currentCreature.tracking} />
          <T title="faction" value={currentCreature.faction} />
          <T title="team" value={currentCreature.team} />
          <T title="species" value={currentCreature.species} />
          <T title="dialogueActivationRange" value={currentCreature.dialogueActivationRange} />
          <T title="collisionRadius" value={currentCreature.collisionRadius} />
          <T title="shieldFlags" value={currentCreature.shieldFlags?.join(', ')} />
          <T title="fieldOfVision" value={currentCreature.fieldOfVision} />
          <T title="attributes" value={currentCreature.attributes?.join(', ')} />
          <T title="levelFirstClass" value={currentCreature.levelFirstClass} />
          <T title="levelSecondClass" value={currentCreature.levelSecondClass} />
          <T title="levelThirdClass" value={currentCreature.levelThirdClass} />
          <T title="morale" value={currentCreature.morale} />
          <T title="moraleBreak" value={currentCreature.moraleBreak} />
          <T title="racialEnemy" value={currentCreature.racialEnemy} />
          <T title="moraleRecoveryTime" value={currentCreature.moraleRecoveryTime} />
          <T title="deity" value={currentCreature.deity} />
          <T title="mageType" value={currentCreature.mageType?.join(', ')} />
          <T title="allegiance" value={currentCreature.allegiance} />
          <T title="general" value={currentCreature.general} />
          <T title="specific" value={currentCreature.specific} />
          <T title="objectSpecs" value={currentCreature.objectSpecs?.join(', ')} />
          <T title="alignment" value={currentCreature.alignment} />
          <T title="globalIdentifier" value={currentCreature.globalIdentifier} />
          <T title="localIdentifier" value={currentCreature.localIdentifier} />
          <T title="dialogueRef" value={currentCreature.dialogueRef} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.acModifier')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="crushingAcModifier" value={currentCreature.crushingAcModifier} />
          <T title="missileAcModifier" value={currentCreature.missileAcModifier} />
          <T title="piercingAcModifier" value={currentCreature.piercingAcModifier} />
          <T title="slashingAcModifier" value={currentCreature.slashingAcModifier} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.saveVersus')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="saveVersusDeath" value={currentCreature.saveVersusDeath} />
          <T title="saveVersusWands" value={currentCreature.saveVersusWands} />
          <T title="saveVersusPolymorph" value={currentCreature.saveVersusPolymorph} />
          <T title="saveVersusBreath" value={currentCreature.saveVersusBreath} />
          <T title="saveVersusSpells" value={currentCreature.saveVersusSpells} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.resistances')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="fireResistance" value={currentCreature.fireResistance} />
          <T title="coldResistance" value={currentCreature.coldResistance} />
          <T title="electricityResistance" value={currentCreature.electricityResistance} />
          <T title="acidResistance" value={currentCreature.acidResistance} />
          <T title="magicResistance" value={currentCreature.magicResistance} />
          <T title="magicFireResistance" value={currentCreature.magicFireResistance} />
          <T title="magicColdResistance" value={currentCreature.magicColdResistance} />
          <T title="slashingResistance" value={currentCreature.slashingResistance} />
          <T title="crushingResistance" value={currentCreature.crushingResistance} />
          <T title="piercingResistance" value={currentCreature.piercingResistance} />
          <T title="missileResistance" value={currentCreature.missileResistance} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.proficiencies')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="bowProficiency" value={currentCreature.bowProficiency} />
          <T title="axeProficiency" value={currentCreature.axeProficiency} />
          <T title="unspentProficiencies" value={currentCreature.unspentProficiencies} />
          {
            currentCreature.version === 'v1.0' && (
              <>
                <T title="largeSwordProficiency" value={currentCreature.largeSwordProficiency} />
                <T title="smallSwordProficiency" value={currentCreature.smallSwordProficiency} />
                <T title="spearProficiency" value={currentCreature.spearProficiency} />
                <T title="bluntProficiency" value={currentCreature.bluntProficiency} />
                <T title="spikedProficiency" value={currentCreature.spikedProficiency} />
                <T title="missileProficiency" value={currentCreature.missileProficiency} />
                <T title="unusedProficiency1" value={currentCreature.unusedProficiency1} />
                <T title="unusedProficiency2" value={currentCreature.unusedProficiency2} />
                <T title="unusedProficiency3" value={currentCreature.unusedProficiency3} />
                <T title="unusedProficiency4" value={currentCreature.unusedProficiency4} />
                <T title="unusedProficiency5" value={currentCreature.unusedProficiency5} />
              </>
            )
          }
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.scripts')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="overrideScriptRef" value={currentCreature.overrideScriptRef} />
          <T title="classScriptRef" value={currentCreature.classScriptRef} />
          <T title="raceScriptRef" value={currentCreature.raceScriptRef} />
          <T title="generalScriptRef" value={currentCreature.generalScriptRef} />
          <T title="defaultScriptRef" value={currentCreature.defaultScriptRef} />
          <T title="scriptName" value={currentCreature.scriptName} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.colourIndex')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="metalColourIndex" value={currentCreature.metalColourIndex} />
          <T title="minorColourIndex" value={currentCreature.minorColourIndex} />
          <T title="majorColourIndex" value={currentCreature.majorColourIndex} />
          <T title="skinColourIndex" value={currentCreature.skinColourIndex} />
          <T title="leatherColourIndex" value={currentCreature.leatherColourIndex} />
          <T title="armorColourIndex" value={currentCreature.armorColourIndex} />
          <T title="hairColourIndex" value={currentCreature.hairColourIndex} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.soundsTitle')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="initialMeetingSoundTlk" value={tlk(currentCreature.initialMeetingSoundRef)} />
          <T title="moraleSoundTlk" value={tlk(currentCreature.moraleSoundRef)} />
          <T title="happySoundTlk" value={tlk(currentCreature.happySoundRef)} />
          <T title="unhappyAnnoyedSoundTlk" value={tlk(currentCreature.unhappyAnnoyedSoundRef)} />
          <T title="unhappySeriousSoundTlk" value={tlk(currentCreature.unhappySeriousSoundRef)} />
          <T title="unhappyBreakingPointSoundTlk" value={tlk(currentCreature.unhappyBreakingPointSoundRef)} />
          <T title="leaderSoundTlk" value={tlk(currentCreature.leaderSoundRef)} />
          <T title="tiredSoundTlk" value={tlk(currentCreature.tiredSoundRef)} />
          <T title="boredSoundTlk" value={tlk(currentCreature.boredSoundRef)} />
          <T title="battleCry1SoundTlk" value={tlk(currentCreature.battleCry1SoundRef)} />
          <T title="battleCry2SoundTlk" value={tlk(currentCreature.battleCry2SoundRef)} />
          <T title="battleCry3SoundTlk" value={tlk(currentCreature.battleCry3SoundRef)} />
          <T title="battleCry4SoundTlk" value={tlk(currentCreature.battleCry4SoundRef)} />
          <T title="battleCry5SoundTlk" value={tlk(currentCreature.battleCry5SoundRef)} />
          <T title="attack1SoundTlk" value={tlk(currentCreature.attack1SoundRef)} />
          <T title="attack2SoundTlk" value={tlk(currentCreature.attack2SoundRef)} />
          <T title="attack3SoundTlk" value={tlk(currentCreature.attack3SoundRef)} />
          <T title="attack4SoundTlk" value={tlk(currentCreature.attack4SoundRef)} />
          <T title="damageSoundTlk" value={tlk(currentCreature.damageSoundRef)} />
          <T title="dyingSoundTlk" value={tlk(currentCreature.dyingSoundRef)} />
          <T title="hurtSoundTlk" value={tlk(currentCreature.hurtSoundRef)} />
          <T title="areaForestSoundTlk" value={tlk(currentCreature.areaForestSoundRef)} />
          <T title="areaCitySoundTlk" value={tlk(currentCreature.areaCitySoundRef)} />
          <T title="areaDungeonSoundTlk" value={tlk(currentCreature.areaDungeonSoundRef)} />
          <T title="areaDaySoundTlk" value={tlk(currentCreature.areaDaySoundRef)} />
          <T title="areaNightSoundTlk" value={tlk(currentCreature.areaNightSoundRef)} />
          <T title="selectCommon1SoundTlk" value={tlk(currentCreature.selectCommon1SoundRef)} />
          <T title="selectCommon2SoundTlk" value={tlk(currentCreature.selectCommon2SoundRef)} />
          <T title="selectCommon3SoundTlk" value={tlk(currentCreature.selectCommon3SoundRef)} />
          <T title="selectCommon4SoundTlk" value={tlk(currentCreature.selectCommon4SoundRef)} />
          <T title="selectCommon5SoundTlk" value={tlk(currentCreature.selectCommon5SoundRef)} />
          <T title="selectCommon6SoundTlk" value={tlk(currentCreature.selectCommon6SoundRef)} />
          <T title="selectAction1SoundTlk" value={tlk(currentCreature.selectAction1SoundRef)} />
          <T title="selectAction2SoundTlk" value={tlk(currentCreature.selectAction2SoundRef)} />
          <T title="selectAction3SoundTlk" value={tlk(currentCreature.selectAction3SoundRef)} />
          <T title="selectAction4SoundTlk" value={tlk(currentCreature.selectAction4SoundRef)} />
          <T title="selectAction5SoundTlk" value={tlk(currentCreature.selectAction5SoundRef)} />
          <T title="selectAction6SoundTlk" value={tlk(currentCreature.selectAction6SoundRef)} />
          <T title="selectAction7SoundTlk" value={tlk(currentCreature.selectAction7SoundRef)} />
          <T title="interaction1SoundTlk" value={tlk(currentCreature.interaction1SoundRef)} />
          <T title="interaction2SoundTlk" value={tlk(currentCreature.interaction2SoundRef)} />
          <T title="interaction3SoundTlk" value={tlk(currentCreature.interaction3SoundRef)} />
          <T title="interaction4SoundTlk" value={tlk(currentCreature.interaction4SoundRef)} />
          <T title="interaction5SoundTlk" value={tlk(currentCreature.interaction5SoundRef)} />
          <T title="insult1SoundTlk" value={tlk(currentCreature.insult1SoundRef)} />
          <T title="insult2SoundTlk" value={tlk(currentCreature.insult2SoundRef)} />
          <T title="insult3SoundTlk" value={tlk(currentCreature.insult3SoundRef)} />
          <T title="compliment1SoundTlk" value={tlk(currentCreature.compliment1SoundRef)} />
          <T title="compliment2SoundTlk" value={tlk(currentCreature.compliment2SoundRef)} />
          <T title="compliment3SoundTlk" value={tlk(currentCreature.compliment3SoundRef)} />
          <T title="special1SoundTlk" value={tlk(currentCreature.special1SoundRef)} />
          <T title="special2SoundTlk" value={tlk(currentCreature.special2SoundRef)} />
          <T title="special3SoundTlk" value={tlk(currentCreature.special3SoundRef)} />
          <T title="reactToDieGeneralSoundTlk" value={tlk(currentCreature.reactToDieGeneralSoundRef)} />
          <T title="reactToDieSpecificSoundTlk" value={tlk(currentCreature.reactToDieSpecificSoundRef)} />
          <T title="responseToCompliment1SoundTlk" value={tlk(currentCreature.responseToCompliment1SoundRef)} />
          <T title="responseToCompliment2SoundTlk" value={tlk(currentCreature.responseToCompliment2SoundRef)} />
          <T title="responseToCompliment3SoundTlk" value={tlk(currentCreature.responseToCompliment3SoundRef)} />
          <T title="responseToInsult1SoundTlk" value={tlk(currentCreature.responseToInsult1SoundRef)} />
          <T title="responseToInsult2SoundTlk" value={tlk(currentCreature.responseToInsult2SoundRef)} />
          <T title="responseToInsult3SoundTlk" value={tlk(currentCreature.responseToInsult3SoundRef)} />
          <T title="dialogHostileSoundTlk" value={tlk(currentCreature.dialogHostileSoundRef)} />
          <T title="dialogDefaultSoundTlk" value={tlk(currentCreature.dialogDefaultSoundRef)} />
          <T title="selectRare1SoundTlk" value={tlk(currentCreature.selectRare1SoundRef)} />
          <T title="selectRare2SoundTlk" value={tlk(currentCreature.selectRare2SoundRef)} />
          <T title="criticalHitSoundTlk" value={tlk(currentCreature.criticalHitSoundRef)} />
          <T title="criticalMissSoundTlk" value={tlk(currentCreature.criticalMissSoundRef)} />
          <T title="targetImmuneSoundTlk" value={tlk(currentCreature.targetImmuneSoundRef)} />
          <T title="inventoryFullSoundTlk" value={tlk(currentCreature.inventoryFullSoundRef)} />
          <T title="pickedPicketSoundTlk" value={tlk(currentCreature.pickedPicketSoundRef)} />
          <T title="hiddenInShadowsSoundTlk" value={tlk(currentCreature.hiddenInShadowsSoundRef)} />
          <T title="spellDisruptedSoundTlk" value={tlk(currentCreature.spellDisruptedSoundRef)} />
          <T title="setTrapSoundTlk" value={tlk(currentCreature.setTrapSoundRef)} />
          <T title="existance4SoundTlk" value={tlk(currentCreature.existance4SoundRef)} />
          <T title="bioSoundTlk" value={tlk(currentCreature.bioSoundRef)} />
          <T title="sound1Tlk" value={tlk(currentCreature.sound1Ref)} />
          <T title="sound2Tlk" value={tlk(currentCreature.sound2Ref)} />
          <T title="sound3Tlk" value={tlk(currentCreature.sound3Ref)} />
          <T title="sound4Tlk" value={tlk(currentCreature.sound4Ref)} />
          <T title="sound5Tlk" value={tlk(currentCreature.sound5Ref)} />
          <T title="sound6Tlk" value={tlk(currentCreature.sound6Ref)} />
          <T title="sound7Tlk" value={tlk(currentCreature.sound7Ref)} />
          <T title="sound8Tlk" value={tlk(currentCreature.sound8Ref)} />
          <T title="sound9Tlk" value={tlk(currentCreature.sound9Ref)} />
          <T title="sound10Tlk" value={tlk(currentCreature.sound10Ref)} />
          <T title="sound11Tlk" value={tlk(currentCreature.sound11Ref)} />
          <T title="sound12Tlk" value={tlk(currentCreature.sound12Ref)} />
          <T title="sound13Tlk" value={tlk(currentCreature.sound13Ref)} />
          <T title="sound14Tlk" value={tlk(currentCreature.sound14Ref)} />
          <T title="sound15Tlk" value={tlk(currentCreature.sound15Ref)} />
          <T title="sound16Tlk" value={tlk(currentCreature.sound16Ref)} />
          <T title="sound17Tlk" value={tlk(currentCreature.sound17Ref)} />
          <T title="sound18Tlk" value={tlk(currentCreature.sound18Ref)} />
          <T title="sound19Tlk" value={tlk(currentCreature.sound19Ref)} />
          <T title="sound20Tlk" value={tlk(currentCreature.sound20Ref)} />
          <T title="sound21Tlk" value={tlk(currentCreature.sound21Ref)} />
          <T title="sound22Tlk" value={tlk(currentCreature.sound22Ref)} />
          <T title="sound23Tlk" value={tlk(currentCreature.sound23Ref)} />
          <T title="sound24Tlk" value={tlk(currentCreature.sound24Ref)} />
          <T title="sound25Tlk" value={tlk(currentCreature.sound25Ref)} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.creature.techInfo')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="knownSpellsOffset" value={currentCreature.knownSpellsOffset} />
          <T title="knownSpellsCount" value={currentCreature.knownSpellsCount} />
          <T title="spellMemorizationInfoOffset" value={currentCreature.spellMemorizationInfoOffset} />
          <T title="spellMemorizationInfoEntriesCount" value={currentCreature.spellMemorizationInfoEntriesCount} />
          <T title="memorizedSpellsOffset" value={currentCreature.memorizedSpellsOffset} />
          <T title="memorizedSpellsCount" value={currentCreature.memorizedSpellsCount} />
          <T title="offsetToItemSlots" value={currentCreature.offsetToItemSlots} />
          <T title="offsetToItems" value={currentCreature.offsetToItems} />
          <T title="countOfItems" value={currentCreature.countOfItems} />
          <T title="offsetToEffects" value={currentCreature.offsetToEffects} />
          <T title="countOfEffects" value={currentCreature.countOfEffects} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Creature;
