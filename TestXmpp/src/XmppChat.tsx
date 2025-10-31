import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native'
import { client, xml } from '@xmpp/client'
import debug from "@xmpp/debug";

export const XmppChat = () => {
  const [jid, setJid] = useState<string | null>(null);

  useEffect(() => {
    const xmpp = client({
      service: 'wss://www.xmpp.jp/ws/',
      domain: 'xmpp.jp',
      username: 'test_crmpam_a',
      password: 'testcrmpama',
    });

    debug(xmpp, true);

    xmpp.on("error", (err) => {
      console.error(err);
    });

    xmpp.on("offline", () => {
      console.log("offline");
    });

    xmpp.on("stanza", onStanza);
    async function onStanza(stanza : any) {
      if (stanza.is("message")) {
        xmpp.removeListener("stanza", onStanza);
        await xmpp.send(xml("presence", { type: "unavailable" }));
        await xmpp.stop();
      }
    }

    xmpp.on("online", async (address) => {
      console.log("online as", address.toString());

      // Makes itself available
      await xmpp.send(xml("presence"));

      // Sends a chat message to itself
      const message = xml(
        "message",
        { type: "chat", to: address },
        xml("body", {}, "hello world"),
      );
      await xmpp.send(message);
    });

    xmpp.start().then((value) => {
      console.log("XMPP client started");
      setJid(value.toString());
    }).catch(console.error);
  }, [])
    
    return (
        <View>
            <Text>
                Log: {jid}
            </Text>
        </View>
    );
}
