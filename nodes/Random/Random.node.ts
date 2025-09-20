import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError, // <-- ADICIONA ESSE
} from 'n8n-workflow';

export class Random implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Random',
		name: 'random',
		icon: 'file:RandomV2.svg',
		group: ['helpers'], // Grupo "helpers" (ajudantes) faz sentido
		version: 1,
		subtitle: '=True Random Number Generator',
		description: 'Gera um número aleatório usando a API do Random.org',
		defaults: {
			name: 'Random',

		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						// Exatamente como pedido no desafio
						name: 'True Random Number Generator',
						value: 'trueRandom',
						action: 'Gera um n mero aleat rio',
					},
				],
				default: 'trueRandom',
			},
			{
				displayName: 'Min',
				name: 'min',
				type: 'number',
				required: true,
				default: 1,
				description: 'O valor mínimo (inclusivo)',
				// Isso faz o campo só aparecer se a operação 'trueRandom' estiver selecionada
				displayOptions: {
					show: {
						operation: ['trueRandom'],
					},
				},
			},
			{
				displayName: 'Max',
				name: 'max',
				type: 'number',
				required: true,
				default: 100,
				description: 'O valor máximo (inclusivo)',
				displayOptions: {
					show: {
						operation: ['trueRandom'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Loop para processar cada item que chega (normalmente só 1)
		for (let i = 0; i < items.length; i++) {
			try {
				const min = this.getNodeParameter('min', i, 1) as number;
				const max = this.getNodeParameter('max', i, 100) as number;

				// Validação básica: min não pode ser maior que max
				if (min > max) {
					throw new NodeOperationError(this.getNode(), 'O valor de "Min" não pode ser maior que o valor de "Max"', {
						itemIndex: i,
					});
				}
				const url = 'https://www.random.org/integers/';
				const options = {
					num: 1,
					min: min,
					max: max,
					col: 1,
					base: 10,
					format: 'plain',
					rnd: 'new',
				};

				// Não usei 'json: true' porque a API retorna texto puro (plain)
				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: url,
					qs: options, // 'qs' é para query string
				});

				// A API retorna o número como string, tipo "42\n".
				// usei .toString() para garantir que é string (caso venha como Buffer)
				// usei .trim() para tirar espaços/quebras de linha
				// e parseInt para transformar em número
				const randomNumber = parseInt(response.toString().trim(), 10);

				const data = {
					randomNumber: randomNumber,
					min: min,
					max: max,
				};

				const newItem: INodeExecutionData = {
					json: data,
					pairedItem: { item: i },
				};
				returnData.push(newItem);

			} catch (error) {
				// Tratamento de erro (seja o nosso erro de Min/Max ou um erro da API)
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}