import React, { useState } from "react";
import { useQuery } from "urql";
import {
  Stack,
  Flex,
  Box,
  Text,
  Heading,
  Badge,
  List,
  ListItem,
  Button,
  Collapse,
  Icon,
  Tooltip
} from "@chakra-ui/core";
import { Link } from "react-router-dom";
import {
  startOfMonth,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  isThisMonth,
  format,
  parse,
  isToday
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
           horaires
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
        bg={rempli ? "green.500" : "red.500"}
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
          {noms.map(nom => (
            <ListItem>
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

const Jour = ({ jour: { date, labOuvert, creneaux }, ...rest }) => {
  const dateObj = parse(date, dateFormat, new Date());
  const commonStyleProps = {
    opacity: isThisMonth(dateObj) ? 1 : 0.5,
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
      as={Link}
      to={`/planning/${date}`}
    >
      {label}
      <CreneauxPreview creneaux={creneaux} mt={4} />
    </Box>
  );
};

const Semaine = ({ label, days, ...rest }) => (
  <Box {...rest}>
    <Badge fontWeight="bold">S{label}</Badge>
    <Stack isInline spacing={0} align="stretch">
      {days.map(jour => (
        <Jour key={jour.date} jour={jour} flex={1} p={2} />
      ))}
    </Stack>
  </Box>
);

const Planning = () => {
  const [mois] = useState(startOfMonth(new Date()));
  const [response] = useQuery({
    query: PLANNING,
    variables: {
      debut: format(startOfWeek(startOfMonth(mois), dateOptions), dateFormat),
      fin: format(endOfWeek(endOfMonth(mois), dateOptions), dateFormat)
    }
  });

  if (response.fetching) {
    return "Récupération des informations du planning…";
  } else if (response.error) {
    return <span>{response.error.message}</span>;
  }

  const semaines = [
    ...response.data.planning.reduce(perWeek, new Map()).values()
  ];

  return (
    <Box>
      <Heading size="2xl">
        {format(mois, "LLLL", new Date(), dateOptions)}
      </Heading>

      <Legende mt={4} />
      <Stack spacing={2} align="stretch">
        {semaines.map(semaine => (
          <Semaine key={semaine.label} mt={4} {...semaine} />
        ))}
      </Stack>
    </Box>
  );
};

export default Planning;
