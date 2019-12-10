import React from "react";
import { useParams, Link as ReactRouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Link,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Stack,
  Badge,
  Flex
} from "@chakra-ui/core";
import { useQuery } from "urql";
import { parse, format, parseISO, addDays, subDays } from "date-fns";
import { fr } from "date-fns/locale";

import PIAFButton from "./PIAFButton";

const dateOptions = { locale: fr };
const dateFormat = "yyyy-MM-dd";

const PLANNING_JOUR = `
  query PlanningJour($date: Date!) {
    planningDuJour(date: $date) {
     date
     labOuvert
     ... on JourOuverture {
       creneaux {
         nom
         postes {
           nom
           horaires {
             debut
             fin
           }
           piaffeur {
             nom
             prenom
             nomAffichage
             telephone
             email
           }
           notes
         }
       }
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
  const asTelUrl = number =>
    number && `tel:+33${number.replace(/[^\d]/g, "").substr(1)}`;

  return (
    <Box py={2}>
      <Heading fontSize="l">
        <Horaires horaires={poste.horaires} mr={2} />
        {poste.nom}
      </Heading>
      {poste.piaffeur.nomAffichage && (
        <Stack isInline justify="space-between">
          <Text flex="1">{poste.piaffeur.nomAffichage}</Text>
          {poste.piaffeur.telephone ? (
            <Link flex="1" href={asTelUrl(poste.piaffeur.telephone)}>
              <Icon name="phone" mr={2} />
              {poste.piaffeur.telephone}
            </Link>
          ) : (
            <Text flex="1">
              <Icon name="phone" mr={2} /> N/A
            </Text>
          )}
          {poste.piaffeur.email ? (
            <Link
              href={`mailto:${poste.piaffeur.email}`}
              title={poste.piaffeur.email}
            >
              <Icon name="email" />
            </Link>
          ) : (
            <Text>N/A</Text>
          )}
        </Stack>
      )}
      {poste.notes && <Text>Note : {poste.notes}</Text>}

      {!poste.piaffeur.nomAffichage && (
        <PIAFButton mt={2} mb={4}>
          Se positionner sur cette PIAF
        </PIAFButton>
      )}
    </Box>
  );
};

const Creneaux = ({ creneaux }) => (
  <Stack spacing={8}>
    {creneaux.map((creneau, index) => (
      <Box key={index} p={5} shadow="md" borderWidth="1px">
        <Heading fontSize="xl">{creneau.nom}</Heading>
        <Stack mt={4} spacing={4}>
          {creneau.postes.map((poste, index) => (
            <Poste poste={poste} key={index} />
          ))}
        </Stack>
      </Box>
    ))}
  </Stack>
);

const DetailJour = () => {
  const { date } = useParams();
  const currentDate =
    date === "aujourdhui" ? format(new Date(), dateFormat, dateOptions) : date;

  const [response] = useQuery({
    query: PLANNING_JOUR,
    variables: {
      date: currentDate
    }
  });

  if (response.fetching) {
    return (
      <Box textAlign="center">
        <Spinner />
        <Box>Récupération des informations de la journée…</Box>
      </Box>
    );
  } else if (response.error) {
    return <span>{response.error.message}</span>;
  }

  const planning = response.data.planningDuJour;
  const currentDateObj = parse(
    currentDate,
    dateFormat,
    new Date(),
    dateOptions
  );
  return (
    <Box>
      <Box mb={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Link
            as={ReactRouterLink}
            to={format(subDays(currentDateObj, 1), dateFormat)}
            title="Voir le jour précédent"
            p={4}
          >
            <Icon name="arrow-left" />
          </Link>
          <Heading size="2xl">
            {format(
              parse(planning.date, dateFormat, new Date(), dateOptions),
              "dd/MM/yyyy",
              dateOptions
            )}
          </Heading>
          <Link
            as={ReactRouterLink}
            to={format(addDays(currentDateObj, 1), dateFormat)}
            title="Voir le jour suivant"
            p={4}
          >
            <Icon name="arrow-right" />
          </Link>
        </Flex>

        <Link as={ReactRouterLink} to="/">
          <Icon name="arrow-back" mr={2} />
          Retourner à l'accueil
        </Link>
      </Box>

      {planning.labOuvert && <Creneaux creneaux={planning.creneaux} />}
      {!planning.labOuvert && (
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          <AlertTitle mr={2}>Lab fermé !</AlertTitle>
          <AlertDescription>
            Le Lab est fermé à cette date. Veuillez vérifiez la date saisie.
          </AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default DetailJour;
