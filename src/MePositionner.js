import React, { useState, useEffect } from "react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Heading,
  Link,
  Icon,
  Spinner,
  Text,
  Stack,
  Badge,
  FormLabel,
  Switch,
  Button
} from "@chakra-ui/core";
import { useQuery } from "urql";
import {
  format,
  parseISO,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday
} from "date-fns";
import { fr } from "date-fns/locale";
import { uniq, take } from "lodash";

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
  return (
    <Box py={4}>
      <Heading fontSize="xl">
        {poste.nomDuCreneau} ({poste.nom})
      </Heading>
      <Text fontSize="lg">
        <Link
          as={ReactRouterLink}
          to={`/planning/${format(poste.date, "yyyy-MM-dd", dateOptions)}`}
        >
          {format(poste.date, "dd/MM/yyyy", dateOptions)}
        </Link>
        <Horaires horaires={poste.horaires} ml={2} />
        <PIAFButton size="xs" ml={2}>
          Se positionner sur cette PIAF
        </PIAFButton>
      </Text>
      {poste.notes && <Text>Note : {poste.notes}</Text>}
    </Box>
  );
};

const FilterToggle = ({ value, children, onChange }) => (
  <Box mr={8}>
    <FormLabel htmlFor={value}>{children}</FormLabel>
    <Switch
      id={value}
      value={value}
      color="teal"
      defaultIsChecked
      onChange={onChange}
    />
  </Box>
);

const Filtres = ({ postes, filters, onChange }) => {
  // const location = useLocation(); TODO

  const creneaux = uniq(postes.map(poste => poste.nomDuCreneau));
  const types = uniq(
    postes.map(poste =>
      poste.nom.startsWith("Caisse") ? "Caisse" : poste.nom.trim()
    )
  );

  const handleChange = filterFn => e => {
    const newFilters = new Map(filters);
    const isChecked = e.target.checked;
    !isChecked
      ? newFilters.set(e.target.value, filterFn)
      : newFilters.delete(e.target.value);
    onChange(newFilters);
  };

  return (
    <Stack spacing={3} p={2}>
      <Box>
        <Text>Jours de la semaine :</Text>
        <Stack spacing={4} direction="row">
          <FilterToggle
            value="mercredi"
            onChange={handleChange(poste => isWednesday(poste.date))}
          >
            Mercredi
          </FilterToggle>
          <FilterToggle
            value="jeudi"
            onChange={handleChange(poste => isThursday(poste.date))}
          >
            Jeudi
          </FilterToggle>
          <FilterToggle
            value="vendredi"
            onChange={handleChange(poste => isFriday(poste.date))}
          >
            Vendredi
          </FilterToggle>
          <FilterToggle
            value="samedi"
            onChange={handleChange(poste => isSaturday(poste.date))}
          >
            Samedi
          </FilterToggle>
        </Stack>
      </Box>

      <Box>
        <Text>Créneau :</Text>
        <Stack spacing={4} direction="row">
          {creneaux.map(creneau => (
            <FilterToggle
              key={creneau}
              value={`creneau-${creneau}`}
              onChange={handleChange(poste => poste.nomDuCreneau === creneau)}
            >
              {creneau}
            </FilterToggle>
          ))}
        </Stack>
      </Box>

      <Box>
        <Text>Type de Poste :</Text>
        <Stack spacing={4} direction="row">
          {types.map(type => (
            <FilterToggle
              key={type}
              value={`type-${type}`}
              onChange={handleChange(poste => poste.nom.startsWith(type))}
            >
              {type}
            </FilterToggle>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

const PAGE_SIZE = 20;
const MePositionner = () => {
  const [response] = useQuery({
    query: POSTES_A_POURVOIR
  });
  const [filters, setFilters] = useState(new Map());
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  useEffect(() => setPageSize(PAGE_SIZE), [filters]);

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

  const postes = response.data.postesAPourvoir.map(poste => ({
    ...poste,
    date: parseISO(poste.date, dateFormat, new Date())
  }));

  // TODO filter from location
  const postesVisibles = take(
    Array.from(filters.values()).reduce(
      (acc, filter) => acc.filter(poste => !filter(poste)),
      postes
    ),
    pageSize
  );

  return (
    <Box>
      <Box mb={4}>
        <Heading size="2xl">Se positionner pour une PIAF</Heading>

        <Link as={ReactRouterLink} to="/">
          <Icon name="arrow-back" mr={2} />
          Retourner à l'accueil
        </Link>
      </Box>

      <Filtres
        postes={postes}
        filters={filters}
        onChange={filters => setFilters(filters)}
      />

      <Stack mt={4} spacing={4}>
        {postesVisibles.map((poste, index) => (
          <Poste poste={poste} key={index} />
        ))}

        {postesVisibles.length === pageSize && (
          <Button onClick={() => setPageSize(pageSize => pageSize + PAGE_SIZE)}>
            Voir plus
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default MePositionner;
