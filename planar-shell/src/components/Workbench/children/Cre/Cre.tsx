import { useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';
import { useCreStore } from './store/creStore';
import { useCreWidgetBridge } from './useCreWidgetBridge';
import { useTranslation } from 'react-i18next';
import { useCreTalk } from './useCreTalk';
import { useTlkStore } from '@/engine/store/planarRuntime';
import { mapCreToTlkRefs } from './mapCreToTlkRefs';
import { useShallow } from 'zustand/react/shallow';
import { isNothing } from '@planar/shared';

import type { FC } from 'react';
import type { Maybe, GhostType } from '@planar/shared';

import styles from './Cre.module.scss';

type TProps = Readonly<{
  title: string;
  value: string | number;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField className={styles.p} disabled variant="standard" label={title} value={value} />;

// TODO [snow]: extend with v11 props
const Cre: FC = () => {
  const { t } = useTranslation();
  useCreWidgetBridge();
  const { startTalk, talking } = useCreTalk();

  useEffect(() => {
    planarLocalStorage.set<Maybe<GhostType>>(planarLocalStorage.currentWidget, 'cre');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  // TODO [snow]: pass loading into <T>...</T> to show loader inside TextFields
  const {
    currentCre,
    disposeCre,
    loadCre,
  } = useCreStore(useShallow(state => ({
    currentCre: state.currentCre,
    disposeCre: state.disposeCre,
    loadCre: state.loadCre,
  })));

  useGhostRouteId('creId', loadCre, disposeCre);

  const lines = useTlkStore(x => x.lines);
  const loadTlkRefs = useTlkStore(x => x.loadTlkRefs);
  const tlk = (ref: number): string => lines.get(ref) ?? `… (${ref})`;

  useEffect(() => () => disposeCre(), []);

  useEffect(() => {
    if (!currentCre) return;
    const tlkRefs = mapCreToTlkRefs(currentCre);
    loadTlkRefs(tlkRefs).catch((e: unknown) => console.error(e));
  }, [currentCre, loadTlkRefs]);

  if (!currentCre) return null;

  return (
    <div>
      <div className={styles.actions}>
        <Button
          disabled={talking}
          onClick={() => { startTalk().catch(e => console.error(e)); }}
        >
          {t('run.cre.talk')}
        </Button>
      </div>

      <T title={tlk(currentCre.tooltipRef)} value={tlk(currentCre.nameRef)} />
      <T title={t('run.cre.hp')} value={`${currentCre.currentHp}/${currentCre.maximumHp}`} />
      <T title={t('run.cre.sex')} value={currentCre.sex} />
      <T title={t('run.cre.race')} value={currentCre.race} />
      { !isNothing(currentCre.theClass) && <T title={t('run.cre.theClass')} value={currentCre.theClass} /> }
      <T title={t('run.cre.gender')} value={currentCre.gender} />

      {/* TODO [snow]: render portraits */}
      <T title="smallPortrait" value={currentCre.smallPortrait} />
      <T title="largePortrait" value={currentCre.largePortrait} />

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.characteristics')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          { !currentCre.strengthPercentageBonus && <T title={t('run.cre.strength')} value={currentCre.strength} />}
          { !!currentCre.strengthPercentageBonus && <T title={t('run.cre.strength')} value={`${currentCre.strength}/${currentCre.strengthPercentageBonus}`} />}
          <T title={t('run.cre.intelligence')} value={currentCre.intelligence} />
          <T title={t('run.cre.wisdom')} value={currentCre.wisdom} />
          <T title={t('run.cre.dexterity')} value={currentCre.dexterity} />
          <T title={t('run.cre.constitution')} value={currentCre.constitution} />
          <T title={t('run.cre.charisma')} value={currentCre.charisma} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.fightCharacteristics')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title={t('run.cre.naturalAc')} value={currentCre.naturalAc} />
          <T title={t('run.cre.effectiveAc')} value={currentCre.effectiveAc} />
          <T title={t('run.cre.thac0')} value={currentCre.thac0} />
          <T title={t('run.cre.numberOfAttacksPerRound')} value={currentCre.numberOfAttacksPerRound} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.secondaryAbilities')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title={t('run.cre.hideInShadows')} value={currentCre.hideInShadows} />
          {
            currentCre.version === 'v1.0' && <T title={t('run.cre.detectIllusion')} value={currentCre.detectIllusion} />
          }
          <T title={t('run.cre.setTraps')} value={currentCre.setTraps} />
          <T title={t('run.cre.lore')} value={currentCre.lore} />
          <T title={t('run.cre.lockpicking')} value={currentCre.lockpicking} />
          <T title={t('run.cre.moveSilently')} value={currentCre.moveSilently} />
          <T title={t('run.cre.findOrDisarmTraps')} value={currentCre.findOrDisarmTraps} />
          <T title={t('run.cre.pickPockets')} value={currentCre.pickPockets} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.other')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="flags" value={currentCre.flags?.join(', ')} />
          <T title="xpGainedForKilling" value={currentCre.xpGainedForKilling} />
          <T title="powerLevelOrXp" value={currentCre.powerLevelOrXp} />
          <T title="goldCarried" value={currentCre.goldCarried} />
          <T title="status" value={currentCre.status?.join(', ')} />
          <T title="animationId" value={currentCre.animationId} />
          <T title="effectVersion" value={currentCre.effectVersion} />
          <T title="reputation" value={currentCre.reputation} />
          <T title="fatigue" value={currentCre.fatigue} />
          <T title="intoxication" value={currentCre.intoxication} />
          <T title="luck" value={currentCre.luck} />
          {
            currentCre.version === 'v1.0' && (
              <>
                <T title="availableInventorySlotsCount" value={currentCre.availableInventorySlotsCount} />
                <T title="nightmareModeModifiersApplied" value={currentCre.nightmareModeModifiersApplied} />
                <T title="translucency" value={currentCre.translucency} />
              </>
            )
          }
          <T title="murderIncrementBy" value={currentCre.murderIncrementBy} />
          <T title="turnUndeadLevel" value={currentCre.turnUndeadLevel} />
          <T title="tracking" value={currentCre.tracking} />
          { !isNothing(currentCre.faction) && <T title="faction" value={currentCre.faction} /> }
          { !isNothing(currentCre.team) && <T title="team" value={currentCre.team} /> }
          { !isNothing(currentCre.species) && <T title="species" value={currentCre.species} /> }
          { !isNothing(currentCre.dialogueActivationRange) && <T title="dialogueActivationRange" value={currentCre.dialogueActivationRange} /> }
          { !isNothing(currentCre.collisionRadius) && <T title="collisionRadius" value={currentCre.collisionRadius} /> }
          <T title="shieldFlags" value={currentCre.shieldFlags?.join(', ')} />
          { !isNothing(currentCre.fieldOfVision) && <T title="fieldOfVision" value={currentCre.fieldOfVision} /> }
          <T title="attributes" value={currentCre.attributes?.join(', ')} />
          <T title="levelFirstClass" value={currentCre.levelFirstClass} />
          <T title="levelSecondClass" value={currentCre.levelSecondClass} />
          <T title="levelThirdClass" value={currentCre.levelThirdClass} />
          <T title="morale" value={currentCre.morale} />
          <T title="moraleBreak" value={currentCre.moraleBreak} />
          <T title="racialEnemy" value={currentCre.racialEnemy} />
          <T title="moraleRecoveryTime" value={currentCre.moraleRecoveryTime} />
          { !isNothing(currentCre.deity) && <T title="deity" value={currentCre.deity} /> }
          <T title="mageType" value={currentCre.mageType?.join(', ')} />
          <T title="allegiance" value={currentCre.allegiance} />
          <T title="general" value={currentCre.general} />
          <T title="specific" value={currentCre.specific} />
          <T title="objectSpecs" value={currentCre.objectSpecs?.join(', ')} />
          <T title="alignment" value={currentCre.alignment} />
          <T title="globalIdentifier" value={currentCre.globalIdentifier} />
          <T title="localIdentifier" value={currentCre.localIdentifier} />
          <T title="dlgRef" value={currentCre.dlgRef} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.acModifier')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="crushingAcModifier" value={currentCre.crushingAcModifier} />
          <T title="missileAcModifier" value={currentCre.missileAcModifier} />
          <T title="piercingAcModifier" value={currentCre.piercingAcModifier} />
          <T title="slashingAcModifier" value={currentCre.slashingAcModifier} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.saveVersus')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="saveVersusDeath" value={currentCre.saveVersusDeath} />
          <T title="saveVersusWands" value={currentCre.saveVersusWands} />
          <T title="saveVersusPolymorph" value={currentCre.saveVersusPolymorph} />
          <T title="saveVersusBreath" value={currentCre.saveVersusBreath} />
          <T title="saveVersusSpells" value={currentCre.saveVersusSpells} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.resistances')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="fireResistance" value={currentCre.fireResistance} />
          <T title="coldResistance" value={currentCre.coldResistance} />
          <T title="electricityResistance" value={currentCre.electricityResistance} />
          <T title="acidResistance" value={currentCre.acidResistance} />
          <T title="magicResistance" value={currentCre.magicResistance} />
          <T title="magicFireResistance" value={currentCre.magicFireResistance} />
          <T title="magicColdResistance" value={currentCre.magicColdResistance} />
          <T title="slashingResistance" value={currentCre.slashingResistance} />
          <T title="crushingResistance" value={currentCre.crushingResistance} />
          <T title="piercingResistance" value={currentCre.piercingResistance} />
          <T title="missileResistance" value={currentCre.missileResistance} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.proficiencies')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="bowProficiency" value={currentCre.bowProficiency} />
          <T title="axeProficiency" value={currentCre.axeProficiency} />
          <T title="unspentProficiencies" value={currentCre.unspentProficiencies} />
          {
            currentCre.version === 'v1.0' && (
              <>
                <T title="largeSwordProficiency" value={currentCre.largeSwordProficiency} />
                <T title="smallSwordProficiency" value={currentCre.smallSwordProficiency} />
                <T title="spearProficiency" value={currentCre.spearProficiency} />
                <T title="bluntProficiency" value={currentCre.bluntProficiency} />
                <T title="spikedProficiency" value={currentCre.spikedProficiency} />
                <T title="missileProficiency" value={currentCre.missileProficiency} />
                <T title="unusedProficiency1" value={currentCre.unusedProficiency1} />
                <T title="unusedProficiency2" value={currentCre.unusedProficiency2} />
                <T title="unusedProficiency3" value={currentCre.unusedProficiency3} />
                <T title="unusedProficiency4" value={currentCre.unusedProficiency4} />
                <T title="unusedProficiency5" value={currentCre.unusedProficiency5} />
              </>
            )
          }
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.scripts')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="overrideScriptRef" value={currentCre.overrideScriptRef} />
          <T title="classScriptRef" value={currentCre.classScriptRef} />
          <T title="raceScriptRef" value={currentCre.raceScriptRef} />
          <T title="generalScriptRef" value={currentCre.generalScriptRef} />
          <T title="defaultScriptRef" value={currentCre.defaultScriptRef} />
          { !isNothing(currentCre.scriptName) && <T title="scriptName" value={currentCre.scriptName} /> }
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.colourIndex')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="metalColourIndex" value={currentCre.metalColourIndex} />
          <T title="minorColourIndex" value={currentCre.minorColourIndex} />
          <T title="majorColourIndex" value={currentCre.majorColourIndex} />
          <T title="skinColourIndex" value={currentCre.skinColourIndex} />
          <T title="leatherColourIndex" value={currentCre.leatherColourIndex} />
          <T title="armorColourIndex" value={currentCre.armorColourIndex} />
          <T title="hairColourIndex" value={currentCre.hairColourIndex} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.soundsTitle')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="initialMeetingSoundTlk" value={tlk(currentCre.initialMeetingSoundRef)} />
          <T title="moraleSoundTlk" value={tlk(currentCre.moraleSoundRef)} />
          <T title="happySoundTlk" value={tlk(currentCre.happySoundRef)} />
          <T title="unhappyAnnoyedSoundTlk" value={tlk(currentCre.unhappyAnnoyedSoundRef)} />
          <T title="unhappySeriousSoundTlk" value={tlk(currentCre.unhappySeriousSoundRef)} />
          <T title="unhappyBreakingPointSoundTlk" value={tlk(currentCre.unhappyBreakingPointSoundRef)} />
          <T title="leaderSoundTlk" value={tlk(currentCre.leaderSoundRef)} />
          <T title="tiredSoundTlk" value={tlk(currentCre.tiredSoundRef)} />
          <T title="boredSoundTlk" value={tlk(currentCre.boredSoundRef)} />
          <T title="battleCry1SoundTlk" value={tlk(currentCre.battleCry1SoundRef)} />
          <T title="battleCry2SoundTlk" value={tlk(currentCre.battleCry2SoundRef)} />
          <T title="battleCry3SoundTlk" value={tlk(currentCre.battleCry3SoundRef)} />
          <T title="battleCry4SoundTlk" value={tlk(currentCre.battleCry4SoundRef)} />
          <T title="battleCry5SoundTlk" value={tlk(currentCre.battleCry5SoundRef)} />
          <T title="attack1SoundTlk" value={tlk(currentCre.attack1SoundRef)} />
          <T title="attack2SoundTlk" value={tlk(currentCre.attack2SoundRef)} />
          <T title="attack3SoundTlk" value={tlk(currentCre.attack3SoundRef)} />
          <T title="attack4SoundTlk" value={tlk(currentCre.attack4SoundRef)} />
          <T title="damageSoundTlk" value={tlk(currentCre.damageSoundRef)} />
          <T title="dyingSoundTlk" value={tlk(currentCre.dyingSoundRef)} />
          <T title="hurtSoundTlk" value={tlk(currentCre.hurtSoundRef)} />
          <T title="areaForestSoundTlk" value={tlk(currentCre.areaForestSoundRef)} />
          <T title="areaCitySoundTlk" value={tlk(currentCre.areaCitySoundRef)} />
          <T title="areaDungeonSoundTlk" value={tlk(currentCre.areaDungeonSoundRef)} />
          <T title="areaDaySoundTlk" value={tlk(currentCre.areaDaySoundRef)} />
          <T title="areaNightSoundTlk" value={tlk(currentCre.areaNightSoundRef)} />
          <T title="selectCommon1SoundTlk" value={tlk(currentCre.selectCommon1SoundRef)} />
          <T title="selectCommon2SoundTlk" value={tlk(currentCre.selectCommon2SoundRef)} />
          <T title="selectCommon3SoundTlk" value={tlk(currentCre.selectCommon3SoundRef)} />
          <T title="selectCommon4SoundTlk" value={tlk(currentCre.selectCommon4SoundRef)} />
          <T title="selectCommon5SoundTlk" value={tlk(currentCre.selectCommon5SoundRef)} />
          <T title="selectCommon6SoundTlk" value={tlk(currentCre.selectCommon6SoundRef)} />
          <T title="selectAction1SoundTlk" value={tlk(currentCre.selectAction1SoundRef)} />
          <T title="selectAction2SoundTlk" value={tlk(currentCre.selectAction2SoundRef)} />
          <T title="selectAction3SoundTlk" value={tlk(currentCre.selectAction3SoundRef)} />
          <T title="selectAction4SoundTlk" value={tlk(currentCre.selectAction4SoundRef)} />
          <T title="selectAction5SoundTlk" value={tlk(currentCre.selectAction5SoundRef)} />
          <T title="selectAction6SoundTlk" value={tlk(currentCre.selectAction6SoundRef)} />
          <T title="selectAction7SoundTlk" value={tlk(currentCre.selectAction7SoundRef)} />
          <T title="interaction1SoundTlk" value={tlk(currentCre.interaction1SoundRef)} />
          <T title="interaction2SoundTlk" value={tlk(currentCre.interaction2SoundRef)} />
          <T title="interaction3SoundTlk" value={tlk(currentCre.interaction3SoundRef)} />
          <T title="interaction4SoundTlk" value={tlk(currentCre.interaction4SoundRef)} />
          <T title="interaction5SoundTlk" value={tlk(currentCre.interaction5SoundRef)} />
          <T title="insult1SoundTlk" value={tlk(currentCre.insult1SoundRef)} />
          <T title="insult2SoundTlk" value={tlk(currentCre.insult2SoundRef)} />
          <T title="insult3SoundTlk" value={tlk(currentCre.insult3SoundRef)} />
          <T title="compliment1SoundTlk" value={tlk(currentCre.compliment1SoundRef)} />
          <T title="compliment2SoundTlk" value={tlk(currentCre.compliment2SoundRef)} />
          <T title="compliment3SoundTlk" value={tlk(currentCre.compliment3SoundRef)} />
          <T title="special1SoundTlk" value={tlk(currentCre.special1SoundRef)} />
          <T title="special2SoundTlk" value={tlk(currentCre.special2SoundRef)} />
          <T title="special3SoundTlk" value={tlk(currentCre.special3SoundRef)} />
          <T title="reactToDieGeneralSoundTlk" value={tlk(currentCre.reactToDieGeneralSoundRef)} />
          <T title="reactToDieSpecificSoundTlk" value={tlk(currentCre.reactToDieSpecificSoundRef)} />
          <T title="responseToCompliment1SoundTlk" value={tlk(currentCre.responseToCompliment1SoundRef)} />
          <T title="responseToCompliment2SoundTlk" value={tlk(currentCre.responseToCompliment2SoundRef)} />
          <T title="responseToCompliment3SoundTlk" value={tlk(currentCre.responseToCompliment3SoundRef)} />
          <T title="responseToInsult1SoundTlk" value={tlk(currentCre.responseToInsult1SoundRef)} />
          <T title="responseToInsult2SoundTlk" value={tlk(currentCre.responseToInsult2SoundRef)} />
          <T title="responseToInsult3SoundTlk" value={tlk(currentCre.responseToInsult3SoundRef)} />
          <T title="dialogHostileSoundTlk" value={tlk(currentCre.dialogHostileSoundRef)} />
          <T title="dialogDefaultSoundTlk" value={tlk(currentCre.dialogDefaultSoundRef)} />
          <T title="selectRare1SoundTlk" value={tlk(currentCre.selectRare1SoundRef)} />
          <T title="selectRare2SoundTlk" value={tlk(currentCre.selectRare2SoundRef)} />
          <T title="criticalHitSoundTlk" value={tlk(currentCre.criticalHitSoundRef)} />
          <T title="criticalMissSoundTlk" value={tlk(currentCre.criticalMissSoundRef)} />
          <T title="targetImmuneSoundTlk" value={tlk(currentCre.targetImmuneSoundRef)} />
          <T title="inventoryFullSoundTlk" value={tlk(currentCre.inventoryFullSoundRef)} />
          <T title="pickedPicketSoundTlk" value={tlk(currentCre.pickedPicketSoundRef)} />
          <T title="hiddenInShadowsSoundTlk" value={tlk(currentCre.hiddenInShadowsSoundRef)} />
          <T title="spellDisruptedSoundTlk" value={tlk(currentCre.spellDisruptedSoundRef)} />
          <T title="setTrapSoundTlk" value={tlk(currentCre.setTrapSoundRef)} />
          <T title="existance4SoundTlk" value={tlk(currentCre.existance4SoundRef)} />
          <T title="bioSoundTlk" value={tlk(currentCre.bioSoundRef)} />
          <T title="sound1Tlk" value={tlk(currentCre.sound1Ref)} />
          <T title="sound2Tlk" value={tlk(currentCre.sound2Ref)} />
          <T title="sound3Tlk" value={tlk(currentCre.sound3Ref)} />
          <T title="sound4Tlk" value={tlk(currentCre.sound4Ref)} />
          <T title="sound5Tlk" value={tlk(currentCre.sound5Ref)} />
          <T title="sound6Tlk" value={tlk(currentCre.sound6Ref)} />
          <T title="sound7Tlk" value={tlk(currentCre.sound7Ref)} />
          <T title="sound8Tlk" value={tlk(currentCre.sound8Ref)} />
          <T title="sound9Tlk" value={tlk(currentCre.sound9Ref)} />
          <T title="sound10Tlk" value={tlk(currentCre.sound10Ref)} />
          <T title="sound11Tlk" value={tlk(currentCre.sound11Ref)} />
          <T title="sound12Tlk" value={tlk(currentCre.sound12Ref)} />
          <T title="sound13Tlk" value={tlk(currentCre.sound13Ref)} />
          <T title="sound14Tlk" value={tlk(currentCre.sound14Ref)} />
          <T title="sound15Tlk" value={tlk(currentCre.sound15Ref)} />
          <T title="sound16Tlk" value={tlk(currentCre.sound16Ref)} />
          <T title="sound17Tlk" value={tlk(currentCre.sound17Ref)} />
          <T title="sound18Tlk" value={tlk(currentCre.sound18Ref)} />
          <T title="sound19Tlk" value={tlk(currentCre.sound19Ref)} />
          <T title="sound20Tlk" value={tlk(currentCre.sound20Ref)} />
          <T title="sound21Tlk" value={tlk(currentCre.sound21Ref)} />
          <T title="sound22Tlk" value={tlk(currentCre.sound22Ref)} />
          <T title="sound23Tlk" value={tlk(currentCre.sound23Ref)} />
          <T title="sound24Tlk" value={tlk(currentCre.sound24Ref)} />
          <T title="sound25Tlk" value={tlk(currentCre.sound25Ref)} />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('run.cre.techInfo')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="knownSpellsOffset" value={currentCre.knownSpellsOffset} />
          <T title="knownSpellsCount" value={currentCre.knownSpellsCount} />
          <T title="spellMemorizationInfoOffset" value={currentCre.spellMemorizationInfoOffset} />
          <T title="spellMemorizationInfoEntriesCount" value={currentCre.spellMemorizationInfoEntriesCount} />
          <T title="memorizedSpellsOffset" value={currentCre.memorizedSpellsOffset} />
          <T title="memorizedSpellsCount" value={currentCre.memorizedSpellsCount} />
          <T title="offsetToItemSlots" value={currentCre.offsetToItemSlots} />
          <T title="offsetToItems" value={currentCre.offsetToItems} />
          <T title="countOfItems" value={currentCre.countOfItems} />
          <T title="offsetToEffects" value={currentCre.offsetToEffects} />
          <T title="countOfEffects" value={currentCre.countOfEffects} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Cre;
