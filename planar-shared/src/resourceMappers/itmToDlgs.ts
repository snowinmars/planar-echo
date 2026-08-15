const itmDlgsMap: Map<string, Set<string>> = new Map<string, Set<string>>([
  ['bladeim.itm', new Set(['bladeim.dlg', 'dbladeim.dlg'])],
  ['bsphere.itm', new Set(['bsphere.dlg', 'dbsphere.dlg'])],
  ['celesti2.itm', new Set(['celesti2.dlg', 'dcelest.dlg'])],
  ['cheats.itm', new Set(['dcheats.dlg'])],
  ['cirlcez.itm', new Set(['dcirlcez.dlg'])],
  ['codexi.itm', new Set(['codexi.dlg', 'dcodexi.dlg'])],
  ['copearc.itm', new Set(['dcopearc.dlg'])],
  ['cube.itm', new Set(['cube.dlg', 'dcube.dlg'])],
  ['dbox.itm', new Set(['dbox.dlg', 'mbox.dlg'])],
  ['doll.itm', new Set(['ddoll.dlg'])],
  ['eaxe.itm', new Set(['deblade.dlg'])],
  ['edag.itm', new Set(['deblade.dlg'])],
  ['efist.itm', new Set(['deblade.dlg'])],
  ['eham.itm', new Set(['deblade.dlg'])],
  ['emace.itm', new Set(['deblade.dlg'])],
  ['finger.itm', new Set(['finger.dlg', 'dfinger.dlg'])],
  ['finnote.itm', new Set(['finnote.dlg', 'dfinnote.dlg'])],
  ['gdiary.itm', new Set(['gdiary.dlg', 'dgdiary.dlg'])],
  ['icteeth.itm', new Set(['diteeth.dlg'])],
  ['ipteeth.itm', new Set(['diteeth.dlg'])],
  ['justfier.itm', new Set(['djustfier.dlg'])],
  ['limlim.itm', new Set(['dpetlimi.dlg'])],
  ['lingash.itm', new Set(['dlingash.dlg'])],
  ['m1cteeth.itm', new Set(['diteeth.dlg'])],
  ['m1pteeth.itm', new Set(['diteeth.dlg'])],
  ['m2cteeth.itm', new Set(['diteeth.dlg'])],
  ['m2pteeth.itm', new Set(['diteeth.dlg'])],
  ['m3cteeth.itm', new Set(['diteeth.dlg'])],
  ['m3pteeth.itm', new Set(['diteeth.dlg'])],
  ['mertwyn.itm', new Set(['dmhead.dlg'])],
  ['modmite.itm', new Set(['drodmm.dlg'])],
  ['monjug.itm', new Set(['monjug.dlg', 'dmonjug.dlg'])],
  ['n1201.itm', new Set(['n1201.dlg', 'dn1201.dlg'])],
  ['p_jrnl.itm', new Set(['p_jrnl.dlg', 'dp_jrnl.dlg'])],
  ['pestil.itm', new Set(['dpestal.dlg'])],
  ['porlens.itm', new Set(['dbportal.dlg', 'dportal.dlg'])],
  ['sctrap.itm', new Set(['sctrap.dlg', 'dsctrap.dlg'])],
  ['skjourn.itm', new Set(['skjourn.dlg', 'dskjourn.dlg'])],
  ['skscrap.itm', new Set(['skscrap.dlg', 'dskscrap.dlg'])],
  ['sohmien.itm', new Set(['sohmien.dlg', 'dsohmien.dlg'])],
  ['sostone.itm', new Set(['sostone.dlg', 'dsostone.dlg'])],
  ['swordow.itm', new Set(['swordow.dlg', 'dswordow.dlg'])],
  ['trelon.itm', new Set(['trelon.dlg', 'dtrelon.dlg'])],
  ['uportal.itm', new Set(['uportal.dlg', 'duportal.dlg'])],
  ['vkey.itm', new Set(['bead.dlg'])],
  ['wscroll.itm', new Set(['wscroll.dlg', 'dwscroll.dlg'])],
]);

const buildDlgItmsMap = (itmDlgsMap: Map<string, Set<string>>): Map<string, Set<string>> => {
  const dlgItmsMap = new Map<string, Set<string>>();
  for (const itmId of itmDlgsMap.keys()) {
    const dlgsIds = itmDlgsMap.get(itmId);
    if (!dlgsIds) throw new Error(`Cannot find dlgs for itm '${itmId}'`);
    for (const dlgId of dlgsIds) {
      let existingItmsIds = dlgItmsMap.get(dlgId);

      if (!existingItmsIds) existingItmsIds = new Set<string>();

      existingItmsIds.add(itmId);
      dlgItmsMap.set(dlgId, existingItmsIds);
    }
  }
  return dlgItmsMap;
};

const dlgItmsMap = buildDlgItmsMap(itmDlgsMap);

export const itmToDlgs = (itmId: string, throwOnNothing = true): string[] => {
  const dlgs = itmDlgsMap.get(itmId);
  if (dlgs) return [...dlgs.values()];
  if (throwOnNothing) throw new Error(`Cannot find dlgs for itm '${itmId}'`);
  return [];
};

export const dlgToItms = (dlgId: string, throwOnNothing = true): string[] => {
  const itms = dlgItmsMap.get(dlgId);
  if (itms) return [...itms.values()];
  if (throwOnNothing) throw new Error(`Cannot find itms for dlg '${dlgId}'`);
  return [];
};
