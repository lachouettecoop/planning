import React, { useState } from "react";
import { useQuery } from "urql";
import {
  Stack,
  Flex,
  Box,
  Text,
  Heading,
  Badge,
  Link,
  List,
  ListItem,
  Button,
  Collapse,
  Icon,
  Tooltip,
  IconButton,
  Spinner
} from "@chakra-ui/core";
import { Link as ReactRouterLink } from "react-router-dom";
import {
  startOfMonth,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  format,
  parse,
  isToday,
  addMonths,
  isSameMonth,
  subMonths,
  max,
  min
} from "date-fns";
import { fr } from "date-fns/locale";

const PLANNING = `
  query Planning($debut: Date!, $fin: Date!) {
    planning(debut: $debut, fin: $fin) {
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

const dateOptions = { locale: fr };
const dateFormat = "yyyy-MM-dd";

const perWeek = (weeks, day) => {
  const date = parse(day.date, dateFormat, new Date());
  const key = format(date, "yy-ww", dateOptions);
  if (!weeks.has(key)) {
    weeks.set(key, {
      label: format(date, "ww", dateOptions),
      days: []
    });
  }

  const week = weeks.get(key);
  weeks.set(key, {
    ...week,
    days: [...week.days, day]
  });
  return weeks;
};

// TODO Définir des constantes qui ont du sens côté GraphQL
const borderStylesForSpecialPostes = nom => {
  const baseStyles = {
    borderWidth: 2
  };

  const ghColor = "yellow.100";
  if (nom === "Grand Hibou") {
    return {
      ...baseStyles,
      borderColor: ghColor
    };
  }
  if (nom.startsWith("Grand Hibou")) {
    return {
      ...baseStyles,
      borderColor: ghColor,
      borderStyle: "dotted"
    };
  }

  if (nom.startsWith("Caisse")) {
    return {
      ...baseStyles,
      borderColor: "teal.100",
      borderRadius: 0
    };
  }

  return {
    ...baseStyles,
    borderColor: "transparent"
  };
};

const Poste = ({ nom, piaffeur, ...rest }) => {
  const rempli = Boolean(piaffeur.nom);
  const styles = borderStylesForSpecialPostes(nom);

  return (
    <Tooltip
      hasArrow
      label={rempli ? `${nom} : ${piaffeur.nomAffichage}` : nom}
      placement="top"
    >
      <Box
        w={4}
        h={4}
        bg={rempli ? "cyan.600" : "cyan.200"}
        borderRadius="lg"
        {...styles}
        {...rest}
      />
    </Tooltip>
  );
};

const Legende = props => {
  const [isOpen, setOpen] = useState(false);
  const handleToggle = () => setOpen(open => !open);
  const noms = [
    "Grand Hibou",
    "Grand Hibou en formation",
    "Caisse",
    "Chouettos"
  ];
  const piaffeur = { nom: "toto" };
  const pasDePiaffeur = { nom: null };
  return (
    <Box {...props}>
      <Button onClick={handleToggle} size="xs">
        <Icon name="question-outline" mr={2} />
        Légende
      </Button>
      <Collapse isOpen={isOpen} mt={2} bg="primary" p={2} color="white">
        <List>
          {noms.map((nom, id) => (
            <ListItem key={id}>
              <Stack isInline spacing={1}>
                <Poste nom={nom} piaffeur={piaffeur} />
                <Poste nom={nom} piaffeur={pasDePiaffeur} />
                <Text ml={2}>{nom}</Text>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

const CreneauxPreview = ({ creneaux, ...rest }) => {
  const hasPostes = ({ postes }) => Array.isArray(postes) && postes.length > 0;

  return creneaux.filter(hasPostes).map(creneau => (
    <Flex wrap="wrap" {...rest}>
      {creneau.postes.map(poste => (
        <Poste {...poste} />
      ))}
    </Flex>
  ));
};

const Jour = ({
  jour: { date, labOuvert, creneaux },
  currentMois,
  ...rest
}) => {
  const dateObj = parse(date, dateFormat, new Date());
  const commonStyleProps = {
    opacity: isSameMonth(dateObj, currentMois) ? 1 : 0.5,
    ...(isToday(dateObj)
      ? {
          bg: "black"
        }
      : {}),
    ...rest
  };

  const label = (
    <Box>
      <Text fontSize="xl">{format(dateObj, "dd", new Date())}</Text>
    </Box>
  );

  if (!labOuvert) {
    return (
      <Box bg="gray.100" color="gray.400" {...commonStyleProps} flexGrow={1}>
        {label}
      </Box>
    );
  }

  return (
    <Box
      bg="primary"
      color="white"
      {...commonStyleProps}
      flexGrow={3}
      as={ReactRouterLink}
      to={`/planning/${date}`}
    >
      {label}
      <CreneauxPreview creneaux={creneaux} mt={4} />
    </Box>
  );
};

const Semaine = ({ label, days, currentMois, ...rest }) => {
  const dates = days.map(day => parse(day.date, "yyyy-MM-dd", new Date()));

  const debut = format(min(dates), "dd/MM");
  const fin = format(max(dates), "dd/MM   ");
  return (
    <Box {...rest}>
      <Badge fontWeight="bold">
        S{label} — Semaine du {debut} au {fin}
      </Badge>
      <Stack isInline spacing={0} align="stretch">
        {days.map(jour => (
          <Jour
            key={jour.date}
            currentMois={currentMois}
            jour={jour}
            flex={1}
            p={2}
          />
        ))}
      </Stack>
    </Box>
  );
};

const Planning = () => {
  const [mois, setMois] = useState(startOfMonth(new Date()));
  const [response] = useQuery({
    query: PLANNING,
    variables: {
      debut: format(startOfWeek(startOfMonth(mois), dateOptions), dateFormat),
      fin: format(endOfWeek(endOfMonth(mois), dateOptions), dateFormat)
    }
  });

  if (response.fetching) {
    return (
      <Box textAlign="center">
        <Spinner />
        <Box>Récupération des informations du planning…</Box>
      </Box>
    );
  } else if (response.error) {
    return <span>{response.error.message}</span>;
  }

  const semaines = [
    ...response.data.planning.reduce(perWeek, new Map()).values()
  ];

  const handleNavigateMonth = adder => () =>
    setMois(current => adder(current, 1));

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <IconButton
          icon="arrow-left"
          aria-label="Voir le mois précédent"
          onClick={handleNavigateMonth(subMonths)}
        />
        <Heading size="2xl">
          {format(mois, "LLLL", new Date(), dateOptions)}
        </Heading>
        <IconButton
          icon="arrow-right"
          aria-label="Voir le mois suivant"
          onClick={handleNavigateMonth(addMonths)}
        />
      </Flex>
      <Link as={ReactRouterLink} to="/">
        <Icon name="arrow-back" mr={2} />
        Retourner à l'accueil
      </Link>

      <Legende mt={4} />
      <Stack spacing={2} align="stretch">
        {semaines.map(semaine => (
          <Semaine key={semaine.label} mt={4} currentMois={mois} {...semaine} />
        ))}
      </Stack>
    </Box>
  );
};

export default Planning;
