// ----------------------------------------------------------------------

const PRIMARY_NAME = ['A', 'N', 'H', 'L', 'Q', 'V', 'W', 'X', 'M', 'Z', '9', '8'];
const SUCCESS_NAME = ['K', 'D', 'Y', 'B', 'O', 'T', 'I', 'J', '1', '4', '5'];
const INFO_NAME = ['P', 'E', 'R', 'S', 'C', 'U', '6', '7', 'F', 'G', '2', '3'];

function getFirstCharacter(name) {
  return name && name.charAt(0).toUpperCase();
}

function getAvatarColor(name) {
  if (PRIMARY_NAME.includes(getFirstCharacter(name))) return 'primary';
  if (INFO_NAME.includes(getFirstCharacter(name))) return 'light_s';
  if (SUCCESS_NAME.includes(getFirstCharacter(name))) return 'light_m';
  return 'default';
}

export default function createAvatar(name) {
  return {
    name: getFirstCharacter(name),
    color: getAvatarColor(name),
  };
}
