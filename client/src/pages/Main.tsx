import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
  padding: 20px;
`;

const Main: React.FC = () => {
  return (
    <MainContainer>
      <p>Tere-tere, soorahvas! 🌿 </p>

      <p>
        Kas istud praegu oma soojärvekese ääres, mängid kannelt 🪕 ja muretsed
        oma rahakoti pärast? Ära muretse! See rakendus aitab sul oma kopikaid
        lugeda sama täpselt, kui Vanaisa Vanapagan oma kullakirstu sisu! 💰
      </p>

      <p>
        Nüüd saad oma rahaasju korraldada otse rabast - ei mingit vajadust
        külasse minna! 🌲 Parem kui soolatern öös, see rakendus näitab sulle
        täpselt, kuhu su raha läheb. Isegi Kratt oleks kadedusest roheline! 🧚‍♂️
      </p>

      <p>
        Ja kui Näkk peaks su rahakoti ära varastama 🧜‍♂️, siis vähemalt tead
        täpselt, palju sul kaduma läks!
      </p>
    </MainContainer>
  );
};

export default Main;
