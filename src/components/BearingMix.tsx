import { bearingStackLabel, getBearing, type BearingMixItem, type BearingId } from '../data/bearings';
import { useT } from '../i18n/useT';
import { BearingCompass } from './BearingCompass';

interface BearingMixProps {
  mix: BearingMixItem[];
  primaryBearingId: BearingId;
  coPrimaryBearingIds?: BearingId[];
  toTendBearingId: BearingId;
}

function AnimalDetail({
  bearingId,
  role,
}: {
  bearingId: BearingId;
  role: 'primary' | 'tend';
}) {
  const { t, L } = useT();
  const b = getBearing(bearingId);
  return (
    <div className={`animalDetail animalDetail--${role}`}>
      <h3 className="animalDetailTitle">
        {role === 'primary'
          ? t('results_animal_primary', { animal: L(b.animal) })
          : t('results_animal_tend', { animal: L(b.animal) })}
      </h3>
      <p className="animalDetailStack">{bearingStackLabel(b, L)}</p>
      <p className="animalDetailBlurb">{L(b.blurb)}</p>
      {role === 'primary' ? (
        <>
          <p className="animalDetailLabel">{t('results_animal_strengths')}</p>
          <p className="animalDetailBody">{L(b.strengths)}</p>
          <p className="animalDetailLabel">{t('results_animal_workOn')}</p>
          <p className="animalDetailBody animalDetailBody--last">{L(b.toWorkOn)}</p>
        </>
      ) : (
        <>
          <p className="animalDetailLabel">{t('results_animal_cultivate')}</p>
          <p className="animalDetailBody">{L(b.strengths)}</p>
          <p className="animalDetailLabel">{t('results_animal_whenThin')}</p>
          <p className="animalDetailBody animalDetailBody--last">{L(b.whenThin)}</p>
        </>
      )}
    </div>
  );
}

export function BearingMix({
  mix,
  primaryBearingId,
  coPrimaryBearingIds,
  toTendBearingId,
}: BearingMixProps) {
  const { t, L } = useT();
  const primary = getBearing(primaryBearingId);
  const coIds = coPrimaryBearingIds ?? [primaryBearingId];
  const coPrimary = coIds.length > 1;
  const primaryLabel = coPrimary
    ? coIds.map((id) => L(getBearing(id).animal)).join('–')
    : bearingStackLabel(primary, L);

  return (
    <div className="bearingMix">
      <h2 className="bearingMixTitle">{t('results_bearingTitle')}</h2>
      <p className="bearingMixIntro">{t('results_bearingIntro')}</p>
      <p className="bearingMixStack">
        {coPrimary
          ? t('results_primary_co', { animals: primaryLabel })
          : t('results_primary', { stack: primaryLabel })}
      </p>

      <BearingCompass mix={mix} highlightIds={coIds} tendId={toTendBearingId} />

      <div className="animalDetailList">
        {coIds.map((id) => (
          <AnimalDetail key={`p-${id}`} bearingId={id} role="primary" />
        ))}
        {!coIds.includes(toTendBearingId) && (
          <AnimalDetail bearingId={toTendBearingId} role="tend" />
        )}
      </div>
    </div>
  );
}
