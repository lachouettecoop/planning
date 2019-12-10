import React from "react";

import {
  Text,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter
} from "@chakra-ui/core";

const NotImplementedYetPIAFButton = ({ children, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <React.Fragment>
      <Button {...props} ref={btnRef} onClick={onOpen}>
        {children}
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Fonctionnalité non disponible</DrawerHeader>

          <DrawerBody>
            <Text>Cette fonctionnalité n'est pas encore disponible.</Text>
            <Text>
              Pour vous positionner sur un créneau pour votre PIAF, merci de
              vous rendre sur le Planning du Lab (comme historiquement).
            </Text>

            <Text mt={4}>
              Nous espérons qu'il sera bientôt possible de tout faire depuis
              cette page.
            </Text>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
};

export default NotImplementedYetPIAFButton;
