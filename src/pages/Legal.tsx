import { Typography } from "@material-ui/core"

const LegalPage = () => {
  return (
    <>
      <Typography variant="h2">Politique de traitement des données personnelles</Typography>
      <p>
        Les informations recueillies sur ces formulaires sont enregistrées dans un fichier informatisé par La Chouette
        Coop SAS, pour permettre la gestion du planning de participation des coopérateurs·rices au fonctionnement de la
        coopérative. La base légale du traitement est le contrat par lequel les coopérateurs·rices s’engagent à
        effectuer 3 heures de participation toutes les 4 semaines à la coopérative.
      </p>
      <p>
        Les données sont communiquées aux seuls coopérateurs·rices de La Chouette Coop. Elles sont conservées pendant la
        durée du mandat de coopérateur·rice et en cas de démission pendant 5 ans maximum.
      </p>
      <p>Les données sont hébergées en France par OVH.</p>
      <p>
        Vous pouvez accéder aux données vous concernant, les rectifier, demander leur effacement ou exercer votre droit
        à la limitation du traitement de vos données. Pour exercer ces droits ou pour toute question sur le traitement
        de vos données dans ce dispositif, vous pouvez contacter :{" "}
        <a href="mailto:bureau-des-membres@lachouettecoop.fr">bureau-des-membres@lachouettecoop.fr</a>
      </p>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits « Informatique et Libertés » ne sont pas respectés,
        vous pouvez adresser une réclamation à la CNIL.
      </p>
    </>
  )
}

export default LegalPage
