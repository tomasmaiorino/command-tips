pipeline {
    agent { 
        node {
            label 'node-js'
        }
    }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}