import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Grivences = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headingText}>Customer Care</Text>
            <Text style={styles.subHeading}>Have you tried searching for your query?</Text>
            <Text style={styles.bodyText}>
                If you still need help, you may contact us via your preferred channel.
                You can also contact Jivo's customer support team via email at info@jivo.in or call our customer 
                care number at 1800 137 4433 (TOLL FREE), and we will resolve your issue at the earliest. We are available 
                24/7 to assist you.
            </Text>
         
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    headingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
});

export default Grivences;
