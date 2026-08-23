# Infinity Engine resource types

Источник описаний: [IESDP](https://gibberlings3.github.io/iesdp/file_formats/index.htm). Зависимости — **прямые runtime resref** (что тип ссылает по имени), не parse-time байты и не транзитивное замыкание.

Сноска: почти все ресурсы лежат в `.bif`/`.cbf` и индексируются `.key`. Строки — `.tlk` (strref). KEY/BIF/TLK **не** повторяются в каждой строке. Исключение: у `.tlk` в Dependencies — `.wav` (sound resref в записи).

Варианты кодека (ACM/Ogg, BAM zlib, WAVC/RIFF/Ogg) слиты в одну строку на расширение.

WeiDU в этом репо также знает `.qsp` (`DecompiledBiffType`). В IESDP-таблице его нет — сюда не добавляли.

`2da` and `twoda` are synonyms.

| Extension | Description | Dependencies | Notes |
|-----------|-------------|--------------|-------|
| `.key` | Directory of resources, locations and types. Usually one file in the game root. | `.bif`, `.cbf` | |
| `.bif` | Archive of resources; indexed by KEY. | `.key` | |
| `.cbf` | zlib-compressed BIF; indexed by KEY. | `.key` | |
| `.tlk` | String/sound table, lookup by strref. | `.wav` | |
| `.acm` | Music. ACM-compressed audio, or Ogg Vorbis. | — | Ogg: EE |
| `.mus` | Music playlist (text). | `.acm` | |
| `.bmp` | Uncompressed BMP (4/8/24-bit). Palettes often stored as 1×1 images. | — | |
| `.mve` | Movie. Proprietary Interplay format. | — | |
| `.wav` | Sound: WAVC (ACM+header), RIFF wave, or Ogg Vorbis. Engine treats WAVC and RIFF interchangeably. Also `.wac`. | — | Ogg: EE. WAVC is ACM plus a header for buffer estimation. |
| `.wfx` | Wave FX: playback variation for wave sounds. | `.wav` | |
| `.plt` | Paperdoll graphics (inventory screen). | — | Not used in PST |
| `.bam` | Animations and multi-frame graphics; cycles of frames. May be zlib-compressed. EE v2 pages into PVRZ. | `.pvrz` | `.pvrz`: EE BAM v2 |
| `.wed` | Area region information (overlays, walls, doors). | `.tis` | |
| `.chu` | GUI definition. | `.bam`, `.mos` | |
| `.tis` | Area art tiles. EE pages into PVRZ. | `.pvrz` | `.pvrz`: EE |
| `.mos` | Minimaps and GUI backgrounds. May be zlib-compressed. EE pages into PVRZ. | `.pvrz` | `.pvrz`: EE |
| `.itm` | Item. | `.bam`, `.eff`, `.wav`, `.spl` | |
| `.spl` | Spell. | `.bam`, `.vvc`, `.pro`, `.eff`, `.wav` | |
| `.bcs` | Compiled script (text after decompile). | `.ids` | |
| `.ids` | Identifier tables (text): numbers → labels for engine internals. | — | |
| `.cre` | Creature. Animation is an id (via INI/2DA), not a BAM resref. Portraits are BMP resrefs. | `.dlg`, `.itm`, `.spl`, `.eff`, `.bcs`, `.wav`, `.bmp`, `.ini`, `.2da` | |
| `.are` | Area: actors, doors, regions, containers. Animation id on actors same as CRE. Song/rest tables are 2DA. | `.wed`, `.cre`, `.bcs`, `.dlg`, `.itm`, `.wav`, `.bam`, `.are`, `.wbm`, `.mve`, `.mos`, `.ini`, `.2da` | `.wbm`: EE rest movies; `.mve`: original |
| `.dlg` | Dialog definition. | `.bcs` | |
| `.2da` | 2-dimensional array (text). Signature may not be at byte 0; may be XOR-encrypted. | — | |
| `.gam` | Saved game: party details. | `.cre`, `.are` | |
| `.sav` | Saved game: area and store details. | `.are`, `.sto` | |
| `.sto` | Store. | `.itm`, `.bam` | |
| `.wmp` | World map. | `.mos`, `.are`, `.bam` | |
| `.eff` | Effect (replaces the 30-byte effect in CRE/ITM). V2.0 as a file or embedded in CRE, ITM, SPL. | `.bam`, `.vvc`, `.wav` | ToTSC, IWD, BG2; also EE |
| `.bs` | Character AI script (text). | `.ids` | |
| `.chr` | Exported character. | `.cre` | |
| `.vvc` | Visual spell-casting effect. | `.bam` | |
| `.vef` | Sequence of visual effects. | `.vvc` | BG2, EE |
| `.pro` | Projectile. | `.bam`, `.vvc`, `.wav` | |
| `.res` | Character biography (text). | — | IWD |
| `.bio` | Character biography (text). | — | BG2 |
| `.wbm` | WebM video: cinematics and ARE rest movies. | — | EE |
| `.fnt` | Proprietary font. | — | EE, before patch 2.0 |
| `.gui` | GUI definitions (text). | `.bam`, `.mos` | EE, before patch 2.0 |
| `.sql` | SQL (text). | — | EE |
| `.pvrz` | zlib-compressed PVR graphics; referenced by BAM, MOS, TIS. | — | EE |
| `.glsl` | Shader text (OpenGL and DirectX variants). | — | EE |
| `.tot` | Talk Table Override Text; used with TOH. | `.tlk`, `.toh` | IWD, BG2 |
| `.toh` | Talk Table Override Header. Original: used with TOT. EE: self-contained. | `.tlk`, `.tot` | IWD, BG2, EE (EE: `.tot` unused) |
| `.menu` | GUI definitions (text). | `.lua`, `.bam`, `.mos`, `.ttf`, `.png` | EE, since patch 2.0 |
| `.lua` | LUA script (text). | — | EE; loaded from `.menu` |
| `.ttf` | TrueType font. | — | EE |
| `.png` | Image. | — | EE, since patch 2.0 |
| `.bah` | Unknown. | — | BG2 |
| `.ini` | Quest/spawn (text). EE: creature animation definitions. | `.cre`, `.bam` | PST, IWD, EE |
| `.src` | Overhead text. | — | PST, PST:EE |
| `.maze` | Modron Maze layout. | `.are` | PST:EE |
| `.baf` | Script source (text). | `.ids` | WeiDU decompile of `.bcs` |
| `.var` | Starting-game variable declarations. | — | PST |
