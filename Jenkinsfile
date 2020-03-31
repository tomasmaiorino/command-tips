pipeline {
    agent { docker { image 'node:6.14.4' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}