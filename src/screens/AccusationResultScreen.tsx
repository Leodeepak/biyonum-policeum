import React, { useEffect } from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { RoomState } from '../types/game';
import { ROLE_DEFINITIONS } from '../data/rolesData';
import { RoleIllustration } from '../components/RoleIllustrations';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sounds } from '../utils/sound';

interface AccusationResultScreenProps {
  room: RoomState;
  onContinueToScoreboard: () => void;
}

export const AccusationResultScreen: React.FC<AccusationResultScreenProps> = ({
  room,
  onContinueToScoreboard
}) => {
  const result = room.latestResult;
  if (!result) return null;

  const policePlayer = room.players.find(p => p.id === result.policeId);
  const accusedPlayer = room.players.find(p => p.id === result.accusedId);
  const thiefPlayer = room.players.find(p => p.id === result.thiefId);

  const accusedRoleDef = ROLE_DEFINITIONS[result.accusedRole];

  useEffect(() => {
    if (result.wasPoliceCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playFailure();
    }
  }, [result]);

  const handleContinue = () => {
    sounds.playClick();
    onContinueToScoreboard();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in space-y-6">
      {/* Verdict Hero Panel */}
      <Card 
        borderColor={result.wasPoliceCorrect ? 'border-[#35B779]' : 'border-[#F05252]'}
        className={result.wasPoliceCorrect ? 'bg-[#E6F9F2]/70' : 'bg-[#FEEFEF]/70'}
      >
        <div className="text-center">
          <span className="text-xs font-mono font-black uppercase tracking-widest text-[#52627A] block mb-1">
            ROUND {room.currentRound} VERDICT
          </span>

          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white border-2 border-[#E4EAF2] mb-3 text-6xl shadow-md animate-bounce">
            {result.wasPoliceCorrect ? '🚨' : '🥷'}
          </div>

          <h2 className={`text-3xl sm:text-4xl font-black ${result.wasPoliceCorrect ? 'text-[#35B779]' : 'text-[#F05252]'}`}>
            {result.wasPoliceCorrect ? 'POLICE FOUND THE THIEF!' : 'ACCUSATION FAILED!'}
          </h2>

          <p className="text-sm text-[#172B4D] mt-2 font-extrabold max-w-md mx-auto">
            Police officer <strong className="text-[#4D8DFF]">{policePlayer?.name}</strong> accused{' '}
            <strong className="text-[#172B4D]">{accusedPlayer?.name}</strong>.
          </p>
        </div>

        {/* Revealed Role Card */}
        <div className="p-4 rounded-3xl bg-white border-2 border-[#E4EAF2] max-w-md mx-auto my-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <RoleIllustration roleType={result.accusedRole} size={54} />
            <div className="text-left">
              <span className="text-[10px] text-[#52627A] uppercase font-black block">ACCUSED PLAYER ROLE</span>
              <h4 className="font-extrabold text-lg text-[#172B4D]">{accusedRoleDef.name}</h4>
              <p className="text-xs font-extrabold text-[#52627A]">{accusedRoleDef.points} Base Points</p>
            </div>
          </div>

          <span 
            className="role-badge text-xs font-black shadow-xs"
            style={{
              backgroundColor: accusedRoleDef.bgColor,
              color: accusedRoleDef.color,
              borderColor: accusedRoleDef.borderColor
            }}
          >
            {accusedRoleDef.points} PTS
          </span>
        </div>

        {/* Outcome Points Summary */}
        <div className="p-4 rounded-2xl bg-white border border-[#E4EAF2] max-w-md mx-auto text-xs space-y-1 shadow-xs text-center font-extrabold">
          {result.wasPoliceCorrect ? (
            <p className="text-[#35B779]">
              ✅ Correct guess! Police ({policePlayer?.name}) receives 200 total points for this round. Thief ({thiefPlayer?.name}) gets 0 points.
            </p>
          ) : (
            <p className="text-[#F05252]">
              ❌ Wrong guess! Police ({policePlayer?.name}) receives 100 total points for this round. Thief ({thiefPlayer?.name}) receives 100 points.
            </p>
          )}
        </div>
      </Card>

      {/* Full Round Points Table */}
      <Card borderColor="border-[#E4EAF2]">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#52627A] flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-[#FFC83D]" /> Round {room.currentRound} Scores Breakdown
        </h3>

        <div className="space-y-2.5">
          {room.players.map(p => {
            const roleType = room.secretRoles[p.id];
            const roleDef = ROLE_DEFINITIONS[roleType];
            const roundScore = result.roundScores[p.id] || 0;

            return (
              <div 
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border-2 border-[#E4EAF2] text-xs shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <RoleIllustration roleType={roleType} size={36} />
                  <div>
                    <span className="font-extrabold text-[#172B4D] text-base block">{p.name}</span>
                    <span 
                      className="text-xs font-extrabold"
                      style={{ color: roleDef.color }}
                    >
                      {roleDef.name} ({roleDef.points} pts)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#35B779] font-mono block">
                    +{roundScore} PTS
                  </span>
                  <span className="text-[10px] text-[#52627A] font-mono font-bold">
                    Total: {p.totalScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="create"
          fullWidth
          onClick={handleContinue}
          className="mt-6"
        >
          <span>View Round Scoreboard</span>
          <ArrowRight className="w-6 h-6" />
        </Button>
      </Card>
    </div>
  );
};
