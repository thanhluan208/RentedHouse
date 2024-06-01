import Personal from "../assets/personal.png";
import Team from "../assets/team.png";

export interface WorkSpaceOption {
  label: string;
  avatar: string;
  value: string;
  type?: string;
}

export const workSpaceOptions = [
  {
    label: "Personal",
    avatar: Personal,
    value: "personal",
  },
  {
    label: "Team 1",
    avatar: Team,
    type: "team",
    value: "team1",
  },
  {
    label: "Team 2",
    avatar: Team,
    type: "team",
    value: "team2",
  },
  {
    label: "Team 3",
    avatar: Team,
    type: "team",
    value: "team3",
  },
];
