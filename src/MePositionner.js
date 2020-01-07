import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Link,
  Icon,
  Spinner,
  Text,
  Stack,
  Badge
} from "@chakra-ui/core";
import { useQuery } from "urql";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

import PIAFButton from "./PIAFButton";

const dateOptions = { locale: fr };
const dateFormat = "yyyy-MM-dd";

const POSTES_A_POURVOIR = `
  query PostesAPourvoir {
    postesAPourvoir {
      nom
      nomDuCreneau
      date
      horaires {
        debut
        fin
      }
    }
  }
`;

const Horaires = ({ horaires: { debut, fin }, ...props }) => {
  const formatHeure = heure =>
    format(parseISO(heure, dateOptions), "HH'h'mm", dateOptions);

  return (
    <Badge variant="solid" {...props}>
      {formatHeure(debut)}-{formatHeure(fin)}
    </Badge>
  );
};

const Poste = ({ poste }) => {
  const date = parseISO(poste.date, dateFormat, new Date());
  return (
    <Box py={4}>
      <Heading fontSize="xl">
        {poste.nomDuCreneau} ({poste.nom})
      </Heading>
      <Text fontSize="lg">
        {format(date, "dd/MM/yyyy", dateOptions)}
        <Horaires horaires={poste.horaires} ml={2} />
        <PIAFButton size="xs" ml={2}>
          Se positionner sur cette PIAF
        </PIAFButton>
      </Text>
      {poste.notes && <Text>Note : {poste.notes}</Text>}
    </Box>
  );
};

const MePositionner = () => {
  const [response] = useQuery({
    query: POSTES_A_POURVOIR
  });

  if (response.fetching) {
    return (
      <Box textAlign="center">
        <Spinner />
        <Box>
          Récupération des postes à pourvoir dans les créneaux d'ouverture…
        </Box>
      </Box>
    );
  } else if (response.error) {
    return <span>{response.error.message}</span>;
  }

  const postes = response.data.postesAPourvoir;

  return (
    <Box>
      <Box mb={4}>
        <Heading size="2xl">Se positionner pour une PIAF</Heading>

        <Link as={ReactRouterLink} to="/">
          <Icon name="arrow-back" mr={2} />
          Retourner à l'accueil
        </Link>
      </Box>

      <Stack mt={4} spacing={4}>
        {postes.map((poste, index) => (
          <Poste poste={poste} key={index} />
        ))}
      </Stack>
    </Box>
  );
};

export default MePositionner;
