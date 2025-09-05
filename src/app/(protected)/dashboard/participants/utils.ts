export const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Aprovado";
    case "rejected":
      return "Rejeitado";
    case "pending":
      return "Pendente";
    default:
      return status;
  }
};

export const getCategoryText = (category: string) => {
  switch (category) {
    case "fado":
      return "Fado";
    case "guitarra":
      return "Guitarra";
    case "concertina":
      return "Concertina";
    default:
      return category;
  }
};

export const getExperienceText = (experience: string) => {
  switch (experience) {
    case "iniciante":
      return "Iniciante";
    case "intermedio":
      return "Intermédio";
    case "avancado":
      return "Avançado";
    default:
      return experience;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};
