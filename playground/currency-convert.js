const axios = require('axios')

const getExchangeRate = async (from, to) => {

    try {
        const response = await axios.get('http://data.fixer.io/api/latest?access_key=531cfb8def3d5891e3a39615c8e7cc61')
        const euro = 1 / response.data.rates[from]
        const rate = euro * response.data.rates[to]
        return rate
    } catch (e) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}`)
    }
    
}

const getCountries = async (currencyCode) => {

    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`)
    return response.data.map((country) => country.name)
}

const convertCurrency = async (from, to, amount) => {
    const convertedAmount = await getExchangeRate(from, to) * amount
    const countriesName = await getCountries(to)
    return `${amount} ${from} is worth ${convertedAmount.toFixed(2)} ${to}. You can spend these in the following countries : ${countriesName.join(', ')}`
}

convertCurrency('CAD', 'USD', 20).then((response) => {
    console.log(response)
}).catch((e) => {
    console.log(e.message)
})
