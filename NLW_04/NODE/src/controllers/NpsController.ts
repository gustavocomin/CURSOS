import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class NpsController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;
        const surveyUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUsers = await surveyUsersRepository.find({
            survey_id,
            value: Not(IsNull()),
        });

        const detractors = surveyUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        const promoters = surveyUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        const passive = surveyUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveyUsers.length;

        const calculate = ((promoters - detractors) / totalAnswers) * 100;

        return response.json({
            detractors,
            promoters,
            passive,
            totalAnswers,
            nps: Number(calculate.toFixed(2)),
        });
    }
}

export { NpsController };
