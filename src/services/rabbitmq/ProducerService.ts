import amqp from 'amqplib';

const ProducerService = {
  sendMessage: async (queue: string, message: string) => {
    const connection = await amqp.connect(
      process.env.RABBITMQ_SERVER as string
    );
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => connection.close(), 1000);
  },
};

export default ProducerService;
