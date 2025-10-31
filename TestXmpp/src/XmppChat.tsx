import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native'
import { Client, client, xml } from '@xmpp/client'
import debug from "@xmpp/debug";
import { useNavigation } from '@react-navigation/native';

export const XmppChat = ({route} : {route: {params: {username: string, password: string}}}) => {
  const [jid, setJid] = useState<string | null>(null);
  const [clientInstance, setClientInstance] = useState<Client | null>(null);
  const [status, setStatus] = useState<string>("disconnected");
  const [messages, setMessages] = useState<Array<{ from: string; body: string }>>([]);
  const [messageText, setMessageText] = useState<string>("");
  const [target, setTarget] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: `Status: ${status}`, headerTintColor: status === 'online' ? 'green' : 'red' });
  }, [navigation, status]);

  useEffect(() => {
    const {username, password} = route.params;
    const xmpp = client({
      service: 'wss://www.xmpp.jp/ws/',
      domain: 'xmpp.jp',
      username,
      password,
    });

    debug(xmpp, true);

    xmpp.on("error", (err) => {
      console.error("Error:", err);
    });

    xmpp.on("offline", () => {
      console.log("offline");
      setStatus("offline");
    });

    xmpp.on("stanza", onStanza);
    async function onStanza(stanza : any) {
      console.log(stanza);
      if (stanza.is("message")) {
        const from = stanza.attrs.from;
        const body = stanza.getChild("body")?.text();
        if (body) {
          setMessages((prevMessages) => [...prevMessages, { from, body }]);
        }
      }
    }

    xmpp.on("online", async (address) => {
      console.log("Online as", address.toString());
      setStatus("online");
      setClientInstance(xmpp);

      // Makes itself available
      await xmpp.send(xml("presence"));
    });

    xmpp.start().then((value) => {
      console.log("XMPP client started");
      setJid(value.toString());
    }).catch(console.error);
    return () => {
      xmpp.stop().catch(console.error);
    };
  }, [route]);

  const sendMessage = async () => {
    if (clientInstance && messageText) {
      console.log("Sending message to", target);
      const message = xml(
        "message",
        { type: "chat", to: target },
        xml("body", {}, messageText),
      );
      await clientInstance.send(message);
      setMessageText("");
    }
  };

    return (
        <View style={{flex: 1, padding: 10, marginBottom: 20}} >
          <Text>
            JID:
          </Text>
          <Text selectable >
              {jid}
          </Text>
          <Text style={{marginTop: 10, fontStyle: 'italic'}}>
            (copia y pega el JID del otro usuario para chatear)
          </Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#aaa', padding: 5, marginVertical: 10 }}
            value={target || ''}
            onChangeText={setTarget}
            placeholder="Target JID"
          />
          <View style={{
            flex: 1,
            margin: 10,
            borderTopWidth: 1,
            borderColor: '#aaa',
            padding: 10,
            backgroundColor: '#f9f9f9',
            flexDirection: "column-reverse"
          }} >
            {messages.map((msg, index) => (
              <View key={index}>
                <Text>{msg.from.split("@")[0]}: {msg.body}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: '#aaa', padding: 5 }}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type a message"
              />
              <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
}
