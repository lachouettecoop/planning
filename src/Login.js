import React, { useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Stack
} from "@chakra-ui/core";
import useAuth from "./useAuth";

const Login = () => {
  const { login } = useAuth();
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    login({
      email: emailInput.current.value,
      password: passwordInput.current.value
    });
  };

  return (
    <Box w="80%" mx="auto">
      <Heading as="h1" my={10}>
        Connexion requise
      </Heading>

      <Box mb={10}>
        <Text>Cette application permet de consulter le planning du Lab.</Text>
        <Text>
          Elle est réservée aux membres de La Chouette Coop. Veuillez vous
          connecter avec vos identifiants habituels.
        </Text>
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={8}>
          <FormControl isRequired>
            <FormLabel htmlFor="email">Adresse email</FormLabel>
            <Input
              type="email"
              id="email"
              aria-describedby="email-helper-text"
              ref={emailInput}
            />
            <FormHelperText id="email-helper-text">
              L’adresse email fournie lors de votre inscription.
            </FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="password">Mot de passe</FormLabel>
            <Input
              type="password"
              id="password"
              aria-describedby="password-helper-text"
              ref={passwordInput}
            />
            <FormHelperText id="password-helper-text">
              Identique à celui utilisé sur les autres outils de La Chouette
              Coop. En cas d’oubli, vous pouvez{" "}
              <Link
                isExternal
                href="https://adminchouettos.lachouettecoop.fr/resetting/request"
              >
                réinitialiser votre mot de passe
              </Link>
              .
            </FormHelperText>
          </FormControl>

          <Button type="submit">Se connecter</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;
