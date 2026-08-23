import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';
import ResrefLink from '@/shared/ResrefLink';
import { useAreStore } from './store/areStore';
import { useAreWidgetBridge } from './useAreWidgetBridge';

import type { FC, ReactNode } from 'react';
import type { Widget } from '@/shared/widget';
import { isNothing, type Maybe, type Point, type Rectangle } from '@planar/shared';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number | boolean>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => (
  <TextField multiline disabled variant="standard" label={title} value={value === undefined || value === null ? '' : String(value)} />
);

type LProps = Readonly<{
  title: string;
  type: string;
  ext: string;
  value: Maybe<string>;
}>;
const L: FC<LProps> = ({ title, type, ext, value }: LProps) => (
  <div>
    <Typography variant="caption">{title}</Typography>
    {' '}
    <ResrefLink type={type} ext={ext} value={value} />
  </div>
);

const point = (p: Point): string => `${p.x}, ${p.y}`;
const rect = (b: Rectangle): string => `${b.left},${b.top} - ${b.right},${b.bottom}`;

type AccordionBlockProps = Readonly<{
  title: string;
  children: ReactNode;
}>;
const AccordionBlock: FC<AccordionBlockProps> = ({ title, children }: AccordionBlockProps) => (
  <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

const Are: FC = () => {
  useAreWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'are');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentAre,
    loadAre,
    disposeAre,
  } = useAreStore(useShallow(state => ({
    loading: state.loading,
    currentAre: state.currentAre,
    loadAre: state.loadAre,
    disposeAre: state.disposeAre,
  })));

  useGhostRouteId('areId', loadAre, disposeAre);

  if (loading && !currentAre) return <CircularProgress />;
  if (!currentAre) return null;

  const header = currentAre.header;

  return (
    <div>
      <T title="resourceName" value={currentAre.resourceName} />
      <AccordionBlock title="header">
        <T title="signature" value={header.signature} />
        <T title="version" value={header.version} />
        <L title="wed" type="wed" ext="wed" value={header.wed} />
        <T title="lastSaved" value={header.lastSaved} />
        <T title="flags" value={header.flags.join(', ')} />
        <L title="northAreaRef" type="are" ext="are" value={header.northAreaRef} />
        <T title="northAreaFlags" value={header.northAreaFlags.join(', ')} />
        <L title="eastAreaRef" type="are" ext="are" value={header.eastAreaRef} />
        <T title="eastAreaFlags" value={header.eastAreaFlags.join(', ')} />
        <L title="southAreaRef" type="are" ext="are" value={header.southAreaRef} />
        <T title="southAreaFlags" value={header.southAreaFlags.join(', ')} />
        <L title="westAreaRef" type="are" ext="are" value={header.westAreaRef} />
        <T title="westAreaFlags" value={header.westAreaFlags.join(', ')} />
        <T title="areaType" value={header.areaType.join(', ')} />
        <T title="rainProbability" value={header.rainProbability} />
        <T title="snowProbability" value={header.snowProbability} />
        <T title="fogProbability" value={header.fogProbability} />
        <T title="lightningProbability" value={header.lightningProbability} />
        <T title="overlayTransparency" value={header.overlayTransparency} />
        <L title="areaScript" type="bcs" ext="bcs" value={header.areaScript} />
        <T title="restMovieDay" value={header.restMovieDay} />
        <T title="restMovieNight" value={header.restMovieNight} />
      </AccordionBlock>
      <T title="exploredBitmaskName" value={currentAre.exploredBitmaskName} />
      {currentAre.actors.map((actor, i) => (
        <AccordionBlock key={`actor_${i}`} title={`actor ${actor.name}`}>
          <T title="name" value={actor.name} />
          <T title="at" value={point(actor.at)} />
          <T title="destX" value={actor.destX} />
          <T title="destY" value={actor.destY} />
          <T title="flags" value={actor.flags.join(', ')} />
          <T title="isSpawnedAsRandomMonster" value={actor.isSpawnedAsRandomMonster} />
          <T title="creResrefLetter" value={actor.creResrefLetter} />
          <T title="animation" value={actor.animation} />
          <T title="direction" value={actor.direction} />
          <T title="expiryTime" value={actor.expiryTime} />
          <T title="wanderDistance" value={actor.wanderDistance} />
          <T title="followDistance" value={actor.followDistance} />
          <T title="presentedAt" value={actor.presentedAt.join(', ')} />
          <T title="numTimesTalkedTo" value={actor.numTimesTalkedTo} />
          <L title="dialog" type="dlg" ext="dlg" value={actor.dialog} />
          <L title="scriptOverride" type="bcs" ext="bcs" value={actor.scriptOverride} />
          <L title="scriptGeneral" type="bcs" ext="bcs" value={actor.scriptGeneral} />
          <L title="scriptClass" type="bcs" ext="bcs" value={actor.scriptClass} />
          <L title="scriptRace" type="bcs" ext="bcs" value={actor.scriptRace} />
          <L title="scriptDefault" type="bcs" ext="bcs" value={actor.scriptDefault} />
          <L title="scriptSpecifics" type="bcs" ext="bcs" value={actor.scriptSpecifics} />
          <L title="cre" type="cre" ext="cre" value={actor.cre} />
        </AccordionBlock>
      ))}
      {currentAre.regions.map((region, i) => (
        <AccordionBlock key={`region_${i}`} title={`region ${region.name}`}>
          <T title="name" value={region.name} />
          <T title="type" value={region.type} />
          <T title="boundingBox" value={rect(region.boundingBox)} />
          <T title="vertices" value={JSON.stringify(region.vertices)} />
          <T title="triggerValue" value={region.triggerValue} />
          <T title="cursorIndex" value={region.cursorIndex} />
          <L title="destinationArea" type="are" ext="are" value={region.destinationArea} />
          <T title="entranceName" value={region.entranceName} />
          <T title="flags" value={region.flags.join(', ')} />
          <T title="infoPointTextRef" value={region.infoPointTextRef} />
          <T title="trapDetectionDifficulty" value={region.trapDetectionDifficulty} />
          <T title="trapRemovalDifficulty" value={region.trapRemovalDifficulty} />
          <T title="trapped" value={region.trapped} />
          <T title="trapDetected" value={region.trapDetected} />
          <T title="trapLaunchAt" value={point(region.trapLaunchAt)} />
          <L title="key" type="itm" ext="itm" value={region.key} />
          <L title="script" type="bcs" ext="bcs" value={region.script} />
          <T title="activation" value={point(region.activation)} />
          <L title="sound" type="wav" ext="wav" value={region.sound} />
          <T title="speaker" value={point(region.speaker)} />
          <T title="speakerNameRef" value={region.speakerNameRef} />
          <L title="dialog" type="dlg" ext="dlg" value={region.dialog} />
        </AccordionBlock>
      ))}
      {currentAre.spawnPoints.map((spawn, i) => (
        <AccordionBlock key={`spawn_${i}`} title={`spawn ${spawn.name}`}>
          <T title="name" value={spawn.name} />
          <T title="at" value={point(spawn.at)} />
          {spawn.creatures.map(cre => <L key={cre} title="creature" type="cre" ext="cre" value={cre} />)}
          <T title="encounterDifficulty" value={spawn.encounterDifficulty} />
          <T title="spawnRate" value={spawn.spawnRate} />
          <T title="method" value={spawn.method.join(', ')} />
          <T title="duration" value={spawn.duration} />
          <T title="wanderDistance" value={spawn.wanderDistance} />
          <T title="followDistance" value={spawn.followDistance} />
          <T title="maxCreatures" value={spawn.maxCreatures} />
          <T title="enabled" value={spawn.enabled} />
          <T title="presentedAt" value={spawn.presentedAt.join(', ')} />
          <T title="probabilityDay" value={spawn.probabilityDay} />
          <T title="probabilityNight" value={spawn.probabilityNight} />
          <T title="frequency" value={spawn.frequency} />
          <T title="countdown" value={spawn.countdown} />
          <T title="weights" value={spawn.weights.join(', ')} />
        </AccordionBlock>
      ))}
      {currentAre.entrances.map((entrance, i) => (
        <AccordionBlock key={`entrance_${i}`} title={`entrance ${entrance.name}`}>
          <T title="name" value={entrance.name} />
          <T title="at" value={point(entrance.at)} />
          <T title="direction" value={entrance.direction} />
        </AccordionBlock>
      ))}
      {currentAre.containers.map((container, i) => (
        <AccordionBlock key={`container_${i}`} title={`container ${container.name}`}>
          <T title="name" value={container.name} />
          <T title="at" value={point(container.at)} />
          <T title="type" value={container.type} />
          <T title="lockDifficulty" value={container.lockDifficulty} />
          <T title="flags" value={container.flags.join(', ')} />
          <T title="trapDetectionDifficulty" value={container.trapDetectionDifficulty} />
          <T title="trapRemovalDifficulty" value={container.trapRemovalDifficulty} />
          <T title="trapped" value={container.trapped} />
          <T title="trapDetected" value={container.trapDetected} />
          <T title="launch" value={point(container.launch)} />
          <T title="boundingBox" value={rect(container.boundingBox)} />
          {container.items.map((item, j) => (
            <AccordionBlock key={`item_${j}`} title={`item ${item.resref}`}>
              <L title="resref" type="itm" ext="itm" value={item.resref} />
              <T title="expiryTime" value={item.expiryTime} />
              <T title="quantity1" value={item.quantity1} />
              <T title="quantity2" value={item.quantity2} />
              <T title="quantity3" value={item.quantity3} />
              <T title="flags" value={item.flags.join(', ')} />
            </AccordionBlock>
          ))}
          <L title="trapScript" type="bcs" ext="bcs" value={container.trapScript} />
          <T title="vertices" value={JSON.stringify(container.vertices)} />
          <T title="triggerRange" value={container.triggerRange} />
          <T title="owner" value={container.owner} />
          <L title="key" type="itm" ext="itm" value={container.key} />
          <T title="breakDifficulty" value={container.breakDifficulty} />
          <T title="lockpickStringRef" value={container.lockpickStringRef} />
        </AccordionBlock>
      ))}
      {currentAre.ambients.map((ambient, i) => (
        <AccordionBlock key={`ambient_${i}`} title={`ambient ${ambient.name}`}>
          <T title="name" value={ambient.name} />
          <T title="at" value={point(ambient.at)} />
          <T title="radius" value={ambient.radius} />
          <T title="height" value={ambient.height} />
          <T title="pitchVariation" value={ambient.pitchVariation} />
          <T title="volumeVariation" value={ambient.volumeVariation} />
          <T title="volume" value={ambient.volume} />
          {ambient.sounds.map(sound => <L key={sound} title="sound" type="wav" ext="wav" value={sound} />)}
          <T title="intervalBase" value={ambient.intervalBase} />
          <T title="intervalVariation" value={ambient.intervalVariation} />
          <T title="presentedAt" value={ambient.presentedAt.join(', ')} />
          <T title="flags" value={ambient.flags.join(', ')} />
        </AccordionBlock>
      ))}
      {currentAre.variables.map((variable, i) => (
        <AccordionBlock key={`var_${i}`} title={`variable ${variable.name}`}>
          <T title="name" value={variable.name} />
          <T title="type" value={variable.type} />
          <T title="resourceType" value={variable.resourceType} />
          <T title="dwordValue" value={variable.dwordValue} />
          <T title="intValue" value={variable.intValue} />
          <T title="doubleValue" value={variable.doubleValue} />
          <T title="scriptNameValue" value={variable.scriptNameValue} />
        </AccordionBlock>
      ))}
      {currentAre.doors.map((door, i) => (
        <AccordionBlock key={`door_${i}`} title={`door ${door.name}`}>
          <T title="name" value={door.name} />
          <T title="doorId" value={door.doorId} />
          <T title="flags" value={door.flags.join(', ')} />
          <T title="openedGeometry" value={JSON.stringify(door.openedGeometry)} />
          <T title="closedGeometry" value={JSON.stringify(door.closedGeometry)} />
          <T title="hitPoints" value={door.hitPoints} />
          <T title="armorClass" value={door.armorClass} />
          <L title="openSound" type="wav" ext="wav" value={door.openSound} />
          <L title="closeSound" type="wav" ext="wav" value={door.closeSound} />
          <T title="cursorIndex" value={door.cursorIndex} />
          <T title="trapDetectionDifficulty" value={door.trapDetectionDifficulty} />
          <T title="trapRemovalDifficulty" value={door.trapRemovalDifficulty} />
          <T title="trapped" value={door.trapped} />
          <T title="trapDetected" value={door.trapDetected} />
          <T title="launch" value={point(door.launch)} />
          <L title="key" type="itm" ext="itm" value={door.key} />
          <L title="script" type="bcs" ext="bcs" value={door.script} />
          <T title="detectionDifficulty" value={door.detectionDifficulty} />
          <T title="lockDifficulty" value={door.lockDifficulty} />
          <T title="openLocation" value={point(door.openLocation)} />
          <T title="closeLocation" value={point(door.closeLocation)} />
          <T title="lockpickStringRef" value={door.lockpickStringRef} />
          <T title="travelTriggerName" value={door.travelTriggerName} />
          <T title="speakerNameRef" value={door.speakerNameRef} />
          <L title="dialog" type="dlg" ext="dlg" value={door.dialog} />
        </AccordionBlock>
      ))}
      {currentAre.animations.map((animation, i) => {
        const usePvrz = animation.flags.includes('use pvrz resref');
        return (
          <AccordionBlock key={`anim_${i}`} title={`animation ${animation.name}`}>
            <T title="name" value={animation.name} />
            <T title="at" value={point(animation.at)} />
            <T title="presentedAt" value={animation.presentedAt.join(', ')} />
            <L
              title="animationResref"
              type={usePvrz ? 'pvrz' : 'bam'}
              ext={usePvrz ? 'pvrz' : 'bam'}
              value={animation.animationResref}
            />
            <T title="bamSequenceNumber" value={animation.bamSequenceNumber} />
            <T title="bamFrameNumber" value={animation.bamFrameNumber} />
            <T title="flags" value={animation.flags.join(', ')} />
            <T title="height" value={animation.height} />
            <T title="transparency" value={animation.transparency} />
            <T title="startFrame" value={animation.startFrame} />
            <T title="loopProbability" value={animation.loopProbability} />
            <T title="skipCycles" value={animation.skipCycles} />
            <L title="palette" type="bmp" ext="bmp" value={animation.palette} />
            <T title="animationWidth" value={animation.animationWidth} />
            <T title="animationHeight" value={animation.animationHeight} />
          </AccordionBlock>
        );
      })}
      {currentAre.automapNotes.map((note, i) => (
        <AccordionBlock key={`note_${i}`} title={`automap ${i}`}>
          <T title="at" value={point(note.at)} />
          <T title="textRef" value={note.textRef} />
          <T title="strrefLocation" value={note.strrefLocation} />
          <T title="markerColor" value={note.markerColor} />
          <T title="controlId" value={note.controlId} />
        </AccordionBlock>
      ))}
      {currentAre.tiledObjects.map((tiled, i) => (
        <AccordionBlock key={`tiled_${i}`} title={`tiled ${tiled.name}`}>
          <T title="name" value={tiled.name} />
          <T title="tileId" value={tiled.tileId} />
          <T title="flags" value={tiled.flags.join(', ')} />
          <T title="openImpeded" value={JSON.stringify(tiled.openImpeded)} />
          <T title="closedImpeded" value={JSON.stringify(tiled.closedImpeded)} />
        </AccordionBlock>
      ))}
      {currentAre.projectileTraps.map((trap, i) => (
        <AccordionBlock key={`ptrap_${i}`} title={`projectile trap ${i}`}>
          <T title="projectile" value={trap.projectile} />
          <T title="missileId" value={trap.missileId} />
          <T title="ticksUntilCheck" value={trap.ticksUntilCheck} />
          <T title="triggersRemaining" value={trap.triggersRemaining} />
          <T title="x" value={trap.x} />
          <T title="y" value={trap.y} />
          <T title="z" value={trap.z} />
          <T title="enemyAlly" value={trap.enemyAlly} />
          <T title="indexOfPartyMemberWhoCreatedIt" value={trap.indexOfPartyMemberWhoCreatedIt} />
        </AccordionBlock>
      ))}
      {!isNothing(currentAre.song) && (
        <AccordionBlock title="song">
          <L title="daySong" type="mus" ext="mus" value={currentAre.song.daySong} />
          <L title="nightSong" type="mus" ext="mus" value={currentAre.song.nightSong} />
          <L title="winSong" type="mus" ext="mus" value={currentAre.song.winSong} />
          <L title="battleSong" type="mus" ext="mus" value={currentAre.song.battleSong} />
          <L title="loseSong" type="mus" ext="mus" value={currentAre.song.loseSong} />
          <L title="altMusic1" type="mus" ext="mus" value={currentAre.song.altMusic1} />
          <L title="altMusic2" type="mus" ext="mus" value={currentAre.song.altMusic2} />
          <L title="altMusic3" type="mus" ext="mus" value={currentAre.song.altMusic3} />
          <L title="altMusic4" type="mus" ext="mus" value={currentAre.song.altMusic4} />
          <L title="altMusic5" type="mus" ext="mus" value={currentAre.song.altMusic5} />
          <L title="mainDayAmbient1" type="mus" ext="mus" value={currentAre.song.mainDayAmbient1} />
          <L title="mainDayAmbient2" type="mus" ext="mus" value={currentAre.song.mainDayAmbient2} />
          <T title="mainDayAmbientVolume" value={currentAre.song.mainDayAmbientVolume} />
          <L title="mainNightAmbient1" type="mus" ext="mus" value={currentAre.song.mainNightAmbient1} />
          <L title="mainNightAmbient2" type="mus" ext="mus" value={currentAre.song.mainNightAmbient2} />
          <T title="mainNightAmbientVolume" value={currentAre.song.mainNightAmbientVolume} />
          <T title="reverb" value={currentAre.song.reverb} />
        </AccordionBlock>
      )}
      {!isNothing(currentAre.restInterruptions) && (
        <AccordionBlock title="restInterruptions">
          <T title="name" value={currentAre.restInterruptions.name} />
          <T title="explanationRefs" value={currentAre.restInterruptions.explanationRefs.join(', ')} />
          {currentAre.restInterruptions.creatures.map(cre => (
            <L key={cre} title="creature" type="cre" ext="cre" value={cre} />
          ))}
          <T title="difficulty" value={currentAre.restInterruptions.difficulty} />
          <T title="removalTime" value={currentAre.restInterruptions.removalTime} />
          <T title="wanderDistance" value={currentAre.restInterruptions.wanderDistance} />
          <T title="followDistance" value={currentAre.restInterruptions.followDistance} />
          <T title="maxCreatures" value={currentAre.restInterruptions.maxCreatures} />
          <T title="enabled" value={currentAre.restInterruptions.enabled} />
          <T title="probabilityDay" value={currentAre.restInterruptions.probabilityDay} />
          <T title="probabilityNight" value={currentAre.restInterruptions.probabilityNight} />
        </AccordionBlock>
      )}
    </div>
  );
};

export default Are;
