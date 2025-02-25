import pandas as pd

if __name__ == '__main__':
    # Read CSV file
    file_path = 'statements/bank_statement.csv'
    df = pd.read_csv(file_path, sep=';', encoding='utf-8')

    # Convert date column to datetime
    df['Kuupäev'] = pd.to_datetime(df['Kuupäev'], errors='coerce', format='%d.%m.%Y')

    # Filter for debit (spending) transactions
    df = df[df['Deebet/Kreedit'] == 'Deebet']

    # Extract year and month from date
    df['Month'] = df['Kuupäev'].dt.to_period('M')

    # Convert "Summa" to numeric and handle possible conversion issues
    df['Summa'] = pd.to_numeric(df['Summa'], errors='coerce')

    # Group by month and calculate sum of spending
    monthly_spending = df.groupby('Month')['Summa'].sum()

    # Find the month with the biggest spending
    max_spending_month = monthly_spending.idxmax()
    max_spending_value = monthly_spending.max()

    print(f'Biggest spending month: {max_spending_month}, Amount: {max_spending_value}')

    # Display aggregated monthly spendings
    print(monthly_spending)
