import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

function publish(topic, data) {
  client.publish(topic, data);
}

export default publish;
