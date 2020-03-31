pipeline {
    agent { 
        node {
            label 'command-tips-node-agent'
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